const { commands, examples, newStatus } = require('../utils/constants');

/**
 * Converts to sentence case
 * @param {string} str
 */
const upperCaseFirst = str => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

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

exports.msg = {
  hello: {
    text: ':wave: Hello',
  },
  help: {
    text: ':cold_sweat: Need help?',
    title: 'How to use',
    att: isAdmin => [examples.base, ...(isAdmin ? examples.admin : examples.user)].join('\n'),
  },
  show: {
    title: {
      adminTitle: 'All tickets',
      userTitle: 'Your tickets',
      userOpen: 'Pending',
      userSolved: 'Solved',
    },
    list: {
      empty: 'No tickets to show. Woohoo :success-bunny:',
      noOpen: 'No open tickets to show. Yay',
      noSolved: 'No solved tickets to show.',
    },
  },
  error: {
    text: ":thinking_face: I don't understand. Check some usage examples below:",
    badTeam: number => `Ticket *#${number}* doesn't exist in this team.`,
    notAllowedStatus: ({ number, status }) => `Not allowed. Ticket *#${number}* is *${status}*`,
    closed: number => `Ticket *#${number}* already closed`,
    notAllowed: 'Not allowed.',
  },
  confirm: {
    text: (command, { number, text, author }) =>
      (command === 'OPEN'
        ? `Submit ticket with text: ${text}?`
        : `${upperCaseFirst(command)} ticket *#${number}* from <@${author}>: ${text}?`),
    submit: (number, text) => `Ticket *#${number}* submitted: ${text}`,
    newStatus: (number, command) => `Ticket *#${number}* is now *${newStatus[command]}*.`,
  },
  btn: {
    no: 'Cancel',
    yes: command => (command === 'UNSOLVE' ? 'Reopen' : upperCaseFirst(command)),
    confirm: command => upperCaseFirst(command),
    view: 'View all',
  },
  notify: number => `Your ticket *#${number}* has been solved :success-bunny:`,
};
