import chalk from 'chalk';
import {TEST} from './test.mjs';

const test = (text: string) => console.log(chalk.red(text));


test(TEST);