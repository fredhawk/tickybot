const { commands } = require('../utils/constants');

/**
 * Parse input received from slack slash command
 * @param {string} inputText
 */
exports.parseInputText = (inputText) => {
  if (!inputText) {
    return { command: 'HELLO' };
  }

  let command;
  let message;
  let number;

  // Tokenize input and uppercase first word
  let tokenized = inputText.match(/\S+/g);
  command = tokenized[0].toUpperCase();

  // Find possible ticket reference and set as referenced ticket number
  const ticketReference = inputText.match(/#\d+/g);
  if (ticketReference) {
    number = +ticketReference[0].substring(1);
    tokenized = tokenized.filter(token => token !== ticketReference[0]);
  }

  // Join message and set no-command to OPEN command
  if (commands.includes(command)) {
    message = tokenized.splice(1).join(' ');
  } else {
    message = tokenized.join(' ');
    command = 'OPEN';
  }

  // If required number or message missing, return ERROR command
  if (
    (!message && command === 'OPEN') ||
    (!number && (command === 'SOLVE' || command === 'UNSOLVE' || command === 'CLOSE'))
  ) {
    command = 'ERROR';
  }

  return {
    command,
    message,
    number,
  };
};
