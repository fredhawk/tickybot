exports.actions = {
  HELP: {
    cmd: 'help',
    description: 'Shows all availabe commands with usage examples.',
    usage: '/ticket help',
  },
  OPEN: {
    cmd: 'open',
    description: 'Opens a new ticket.',
    usage: '/ticket open [message]',
  },
  CLOSE: {
    cmd: 'close',
    description: 'Closes a ticket.',
    usage: '/ticket #[ticket number]',
  },
  UNSOLVE: {
    cmd: 'unsolve',
    description:
      "Reopens the ticket and gets the ticket back to admin's list of open tickets. Optional update message possible",
    usage: 'unsolve #[ticket number] [message]',
  },
  SOLVE: {
    cmd: 'solve',
    description:
      'Solve the ticket. Notifies the user and requires an action. Can be reopened or closed by a user who initially opened the ticket.',
    usage: '/ticket solve #[ticket number]',
  },
  // TODO add admin add/remove commands
  // addAdmin: {},
  // removeAdmin: {}
};
