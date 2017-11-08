exports.commands = ['HELP', 'SHOW', 'OPEN', 'CLOSE', 'UNSOLVE', 'SOLVE'];

exports.examples = {
  base: ['`/ticket help` to show usage instructions.'],
  user: [
    '`/ticket show` to show a list of your solved and open tickets.',
    '`/ticket [message]` or `/ticket open [message]` to open a new ticket.',
    '`/ticket unsolve #[ticket number]` to reopen a ticket.',
    '`/ticket close #[ticket number]` to close a ticket.',
  ],
  admin: [
    '`/ticket show` to show a list of open tickets.',
    '`/ticket solve #[ticket number]` to solve a ticket and notifiy the author.',
  ],
};

exports.newStatus = {
  CLOSE: 'closed',
  SOLVE: 'solved',
  UNSOLVE: 'open',
};
