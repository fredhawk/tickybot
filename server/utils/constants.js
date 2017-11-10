exports.commands = ['HELP', 'SHOW', 'OPEN', 'CLOSE', 'UNSOLVE', 'SOLVE'];

exports.examples = {
  full: {
    user: [
      'Use `/ticket` to report issues and problems to team admins. You will be notified when your issue has been fixed.',
      '`/ticket help` to show usage instructions.',
      '`/ticket show` to show a list of your solved and open tickets.',
      '`/ticket [message]` or `/ticket open [message]` to open a new ticket.',
      '`/ticket unsolve #[ticket number]` to reopen a ticket.',
      '`/ticket close #[ticket number]` to close a ticket.',
    ],
    admin: [
      '`/ticket help` to show usage instructions.',
      '`/ticket show` to show a list of open tickets.',
      '`/ticket solve #[ticket number]` to solve a ticket and notifiy the author.',
    ],
  },
  short: {
    user: 'Use `/ticket close/unsolve #[ticket number]` to update a ticket.',
    admin: 'Use `/ticket solve #[ticket number]` to solve a ticket.',
  },
};

exports.newStatus = {
  CLOSE: 'closed',
  SOLVE: 'solved',
  UNSOLVE: 'open',
};
