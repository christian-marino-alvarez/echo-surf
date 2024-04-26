import chalk from '../../node_modules/chalk/source/index.mjs';
import { TEST } from './test.mjs';

const test = (text) => console.log(chalk.red(text));
test(TEST);
