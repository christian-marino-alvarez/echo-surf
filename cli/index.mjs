
import readline from 'node:readline/promises';
import { exit } from 'node:process';
import { stdin as input, stdout as output } from  'node:process';
import { build } from 'vite';
import {Statement, Response, ExitCode, Color} from './prompts.mjs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import {readdir} from 'node:fs/promises';
import { copyFile, constants } from 'node:fs/promises';


const __dirname = fileURLToPath(new URL('.', import.meta.url))

class Cli {
  #answer = [];
  #server = null;

  get answer() {
    return this.#answer;
  }

  set answer(value) {
    if (value != this.#answer) {
      this.#answer = value;
      this.onAnswer(value);
    }
  }

  static log(color = Color.RESET, text) {
    console.log(`${color}${text}`);
  }

  static async readFolder(path, options)  {
    try {
      let files = await readdir(path, {recursive: false, });
      if (options?.exclude) {
        files = files.filter((fileName) => !options.exclude.includes(fileName));
      }

      if (options?.include) {
        files = files.filter((fileName) => options.include.includes(fileName));
      }
      return files;  
    } catch(error) {
      exit(3);
    }
  }

  constructor() {
    this.reader = readline.createInterface({ input, output });
    this.question(Statement.Initial());
    process.on('exit', (code) => this.onExit(code))
  }

  onExit(code) {
    const exitReason = Object
      .entries(ExitCode)
      .filter(([, reason]) => reason.value === code )
      .map(([, value]) => value);
      const [{reason}] = exitReason;
    
    switch(reason) {
      case ExitCode.Success.reason: {
        Cli.log(Color.WHITE, reason)
        break;
      }

      case ExitCode.BuildDenied.reason: {
        console.clear();
        Cli.log(Color.RED, reason)
        break;
      }
    }
    
  }

  static isYes(response) {
    return Response.Yes.includes(response);
  }

  static isNo(response) {
    return Response.No.includes(response);
  }

  setStep(text) {
    setTimeout(() => {
      Cli.log(text);
    }, 1000);
  }

  async compileJs(root) {
    const files = await Cli.readFolder(`${root}/src`, {exclude: ['manifest.json']});
    const input = {};
    for (const filePath of files) {
      input[`src/${filePath}/index`] = `${root}/src/${filePath}/index.mts`;
    }
    try {
      await build({
        root,
        include: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx', '**/*.mjs', '**/*.json', '**/*.mts'],
        esbuild: {
          logLevel: 'verbose'
        },
        build: {
          ssr: false,
          ssrManifest: false,
          target: 'esnext',
          outDir: `dist`,
          emptyOutDir: true,
          minify: false,
          emptyOutDir: true,
          rollupOptions: {
            input,
            preserveEntrySignatures: 'strict',
            output: {
              esModule: true,
              preserveModules: true,
              format: 'es',
              entryFileNames: '[name].mjs',
              interop: true,
            }
          },
          lib: {
            formats: ['es'],
            entry: `${root}/src/service-worker/index.mts`,
          }
        }
      });
    } catch(error) {
      Cli.log(Color.RED, `The application has an error ${error.message}`);
    }
  }

  async compileManifestJson(root) {
    Cli.log(Color.GREEN, 'Starting to compile manifest...');
    const files = await Cli.readFolder(`${root}/src`, {include: ['manifest.json']});
    await copyFile(`${root}/src/${[files]}`, `${root}/dist/${[files]}`);
  }

  async runBuild() {
    const root = path.resolve(__dirname, './../');
    Cli.log(Color.BLUE, 'Start to run build with...');
    await this.compileJs(root);
    await this.compileManifestJson(root);
    Cli.log(Color.GREEN, '✓ Finish build process');
    exit(ExitCode.Success.value);
  }

  async onAnswer() {
    const response = this.answer.toString().toLowerCase();
    if (Cli.isYes(response)) {
      await this.runBuild();
    } else if (Cli.isNo(response)) {
      exit(ExitCode.BuildDenied.value);
    } else {
      setTimeout(() => {
        console.clear();
        this.question(Statement.Initial(true));
      }, 1000);
    }
  }

  async question(statement) {
    this.answer = await this.reader.question(`${statement}`);
  }
}


const cli = new Cli();
