const attach = require('./attachments');
const firebaseHandler = require('../handlers/firebaseHandlers');

// Example of how to use firebase handlers
// const { user_id, user_name, text } = req.body;
// const userResult = await firebaseHandler.addUser(user_id, user_name);
// const ticketResult = await firebaseHandler.addNewTicket(user_id, text);
// const tickets = await firebaseHandler.getAllTickets();

exports.HELLO = async ({ isAdmin }) => {
  // show open and/or pending tickets and usage instructions
  const tickets = await firebaseHandler.getAllTickets();
  return {
    text: 'Hello :wave:',
    attachments: [attach.show(isAdmin, tickets), attach.usage(isAdmin)],
  };
};

exports.HELP = ({ isAdmin }) =>
  // show usage instructions
  ({
    text: 'Need help? Here are some exmaples:',
    attachments: [attach.usage(isAdmin)],
  });

exports.SHOW = async ({ isAdmin }) => {
  // show open and/or pending tickets
  const tickets = await firebaseHandler.getAllTickets();
  return {
    attachments: [attach.show(isAdmin, tickets)],
  };
};

exports.ERROR = ({ isAdmin }) =>
  // response to unrecognized inputs
  ({
    text: "I don't understand.. :thinking_face: \n Check some usage examples below:",
    attachments: [attach.usage(isAdmin)],
  });

// FIXME At the moment directly saves the ticks. Will rework into asking confirmation first
exports.OPEN = async ({ user_id, message }) => {
  // await firebaseHandler.addNewTicket(user_id, message);
  return {
    // construct the ticket and ask for confirmation
    text: `Ticket ${message} saved. I'll ask for a confirmation in a later releaase. Sorry ;)`,
  };
};

exports.CLOSE = ({ ticketNumber }) =>
  // ask for confirmation
  ({
    text: 'Are you sure?',
  });

exports.SOLVE = ({ ticketNumber }) => {};
exports.UNSOLVE = ({ ticketNumber }) => {};
