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
  hello: { text: ':wave: Hello! Need help with `/ticket`?' },
  help: {
    text: ':wave: Need help with `/ticket`?',
    title: 'How to use',
    att: isAdmin => [...(isAdmin ? examples.full.admin : examples.full.user)].join('\n'),
  },
  show: {
    title: {
      adminTitle: 'All tickets',
      userTitle: 'Your tickets',
      userOpen: 'Pending',
      userSolved: 'Solved',
    },
    list: {
      empty: 'No tickets to show. :success-bunny:',
      noOpen: 'No open tickets to show. :success-bunny:',
      noSolved: 'No solved tickets to show.',
    },
  },
  error: {
    text: ":thinking_face: I'm sorry, I don't understand. Check usage instructions below:",
    badTeam: number => `:no_entry_sign: Ticket *#${number}* doesn't exist in this team.`,
    notAllowedStatus: ({ number, author, status }) =>
      `:no_entry_sign: Not allowed. Ticket *#${number}* from <@${author}> is *${status}*.`,
    closed: number => `:no_entry_sign: Ticket *#${number}* already closed`,
    notAllowed: ':no_entry_sign: Not allowed.',
  },
  confirm: {
    text: (command, { number, text, author }) => {
      switch (command) {
        case 'OPEN':
          return `Open new ticket with text: ${text}?`;
        case 'SOLVE':
          return `Solve ticket *#${number}* from <@${author}>: ${text}?`;
        case 'UNSOLVE':
          return `Reopen ticket *#${number}*: ${text}?`;
        default:
          return `Close ticket *#${number}*: ${text}?`;
      }
    },
    submit: (number, text) => `:white_check_mark: Ticket *#${number}* opened: ${text}`,
    newStatus: (number, command) =>
      `:white_check_mark: Ticket *#${number}* is now *${newStatus[command]}*.`,
  },
  btn: {
    no: 'Cancel',
    yes: command => (command === 'UNSOLVE' ? 'Reopen' : upperCaseFirst(command)),
    confirm: command => upperCaseFirst(command),
    view: 'View all',
  },
  notify: number => `Your ticket *#${number}* has been solved :success-bunny:`,
};
