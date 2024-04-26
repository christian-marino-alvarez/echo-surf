export const RESET = "\x1b[0m";
export const RED = "\x1b[31m";
export const GREEN = "\x1b[32m";
export const YELLOW = "\x1b[33m";
export const BLUE = "\x1b[34m";
export const MAGENTA = "\x1b[35m";
export const CYAN = "\x1b[36m";
export const WHITE = "\x1b[37m";


export const Color = {
  RESET,
  RED,
  GREEN,
  YELLOW,
  BLUE,
  MAGENTA,
  CYAN,
  WHITE,
};

export const Statement = {
  Initial: (reTry = '') => `Hello ${reTry ? 'again' : '' }, Do you want to create a new extension build? (${GREEN}y${RESET}/${RED}n${RESET})`,
};

export const ExitCode = {
  BuildDenied: { value: 1, reason: `${RESET}You ${RED}denied${RESET} create a new build.\n${WHITE}>>>> See you soon <<<<<`},
  Success: { value: 0, reason: 'Good Job and Good Bye!!'},
  EmptyPath: {value: 3, reason: 'The folder is empty'},
};

export const Response = {
  Yes: ['yes', 'y'],
  No: ['no', 'n'],
  buildDenied: `${WHITE}Ohhh, thanks for your time. See you soon!!!`,
  mistakeTryAgain: `${WHITE}Sorry, I don't understand you. Could you try to response again? Thanks`, 
};


