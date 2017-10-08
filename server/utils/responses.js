const attach = require('./attachments');

// Example of how to use firebase handlers
// const { user_id, user_name, text } = req.body;
// const userResult = await firebaseHandler.addUser(user_id, user_name);
// const ticketResult = await firebaseHandler.addNewTicket(user_id, text);
// const tickets = await firebaseHandler.getAllTickets();

exports.HELLO = ({ isAdmin }) =>
  // show open and/or pending tickets and usage instructions
  ({
    text: 'Hello :wave:',
    attachments: [attach.status(isAdmin), attach.usage(isAdmin)],
  });

exports.HELP = ({ isAdmin }) =>
  // show usage instructions
  ({
    text: 'Need help? Here are some exmaples:',
    attachments: [attach.usage(isAdmin)],
  });

exports.SHOW = ({ isAdmin }) =>
  // show open and/or pending tickets
  ({
    attachments: [attach.status(isAdmin)],
  });

exports.ERROR = ({ isAdmin }) =>
  // response to unrecognized inputs
  ({
    text: "I'm sorry, I don't understand.. :thinking_face:",
    attachments: [attach.usage(isAdmin)],
  });

exports.OPEN = ({ message }) =>
  // construct the ticket and ask for confirmation
  ({
    text: 'Are you sure?!',
  });

exports.CLOSE = ({ ticketId }) =>
  // ask for confirmation
  ({
    text: 'Are you sure?',
  });

exports.SOLVE = () => {};
exports.UNSOLVE = () => {};
