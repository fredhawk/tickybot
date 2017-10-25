const attach = require('./attachments');
const firebaseHandler = require('../handlers/firebaseHandlers');

// Show open and/or pending tickets and usage instructions
exports.HELLO = async ({ isAdmin, teamId }) => {
  const tickets = await firebaseHandler.getAllOpenTicketsByTeam(teamId);
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
exports.SHOW = async ({ isAdmin, teamId }) => {
  const tickets = await firebaseHandler.getAllOpenTicketsByTeam(teamId);
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
  userId, teamId, username, message, isAdmin,
}) => {
  console.log({ message });
  const ticketNumber = await firebaseHandler.addNewTicket(
    userId,
    teamId,
    username,
    message,
    isAdmin,
  );
  return {
    attachments: [attach.confirmOpen(ticketNumber, message)],
  };
};

// TODO Ask for confirmation
exports.CLOSE = ({ ticketNumber }) => ({
  text: `Close ticket #${ticketNumber}?`,
});

// Change ticket status
exports.SOLVE = ({ isAdmin, ticketNumber }) => ({
  text: `Solving ticket #${ticketNumber}`,
});
exports.UNSOLVE = ({ ticketNumber }) => ({
  text: `Nope. # ${ticketNumber}isn't solved`,
});
