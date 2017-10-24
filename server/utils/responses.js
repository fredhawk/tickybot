const attach = require('./attachments');
const firebaseHandler = require('../handlers/firebaseHandlers');

// Show open and/or pending tickets and usage instructions
exports.HELLO = async ({ isAdmin }) => {
  const tickets = await firebaseHandler.getAllOpenTickets();
  return {
    text: 'Hello :wave:',
    attachments: [attach.show(isAdmin, tickets), attach.usage(isAdmin)],
  };
};

// Show usage instructions
exports.HELP = ({ isAdmin }) => ({
  text: 'Need help? Here are some exmaples:',
  attachments: [attach.usage(isAdmin)],
});

// Show open tickets to admins and open/solved to users
exports.SHOW = async ({ isAdmin, user_id, team_id }) => {
  const tickets = await firebaseHandler.getAllOpenTicketsByTeam(team_id)
  return {
    attachments: [attach.show(isAdmin, tickets)],
  };
};

// Response to unrecognized inputs
exports.ERROR = ({ isAdmin }) => ({
  text: "I don't understand.. :thinking_face: \n Check some usage examples below:",
  attachments: [attach.usage(isAdmin)],
});

// FIXME At the moment directly saves the tickets. Will rework into asking confirmation first
exports.OPEN = async ({
  user_id, team_id, message, isAdmin, user_name,
}) => {
  await firebaseHandler.addNewTicket(user_id, team_id, user_name, message, isAdmin);
  return {
    text: `Ticket ${message} saved. I'll ask for a confirmation in a later releaase. Sorry ;)`,
  };
};

// TODO Ask for confirmation
exports.CLOSE = ({ ticketNumber }) => ({
  text: `Close ticket #${ticketNumber}?`,
});

// Change ticket status
exports.SOLVE = ({ ticketNumber }) => {};
exports.UNSOLVE = ({ ticketNumber }) => {};
