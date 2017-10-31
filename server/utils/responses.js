const attach = require('./attachments');
const firebaseHandler = require('../handlers/firebaseHandlers');

// Show open and/or pending tickets and usage instructions
exports.HELLO = async ({ isAdmin, teamId, userId }) => {
  const tickets = await firebaseHandler.getAllOpenTicketsByTeam(teamId);
  return {
    text: ':wave: Hello',
    attachments: [attach.show(isAdmin, tickets, userId), attach.usage(isAdmin)],
  };
};

// Show usage instructions
exports.HELP = ({ isAdmin }) => ({
  resplace_original: false,
  text: 'Need help? Here are some exmaples:',
  attachments: [attach.usage(isAdmin)],
});

// Show open tickets to admins and open/solved to users
exports.SHOW = async ({ isAdmin, teamId, userId }) => {
  const tickets = await firebaseHandler.getAllOpenTicketsByTeam(teamId);
  return {
    resplace_original: false,
    attachments: [attach.show(isAdmin, tickets, userId)],
  };
};

// Response to unrecognized inputs
exports.ERROR = ({ isAdmin }) => ({
  text: "I don't understand.. :thinking_face: \n Check some usage examples below:",
  attachments: [attach.usage(isAdmin)],
});

// Ask for confirmation before submitting a ticket
exports.OPEN = async ({ isAdmin, ticketText }) => ({
  attachments: [attach.confirmOpen(ticketText)],
});

exports.CANCEL_OPEN = ({ isAdmin }) => {
  const text = 'Submit cancelled.';
  return {
    resplace_original: true,
    attachments: [attach.helpOrShowInteractive(isAdmin, text)],
  };
};

exports.CONFIRM_OPEN = async ({
  userId, teamId, username, isAdmin, data: ticketText,
}) => {
  const ticketNumber = await firebaseHandler.addNewTicket(
    userId,
    teamId,
    username,
    ticketText,
    isAdmin,
  );
  const text = `Ticket #${ticketNumber} submitted: ${ticketText}`;
  return {
    resplace_original: true,
    attachments: [attach.helpOrShowInteractive(isAdmin, text)],
  };
};

// TODO Ask for confirmation
exports.CLOSE = async ({
  isAdmin, ticketNumber, ticketId, userId,
}) => {
  const ticketAuthor = await firebaseHandler.getAuthorByTicketId(ticketId);
  if (!isAdmin && ticketAuthor === userId) {
    return {
      attachments: [attach.confirmClose(ticketNumber, ticketId)],
    };
  }
  return {
    text: 'Not allowed.',
  };
};

exports.CANCEL_CLOSE = ({ isAdmin }) => {
  const text = 'Close cancelled.';
  return {
    resplace_original: true,
    attachments: [attach.helpOrShowInteractive(isAdmin, text)],
  };
};

exports.CONFIRM_CLOSE = async ({ data: ticketId, userId, teamId }) => {
  const ticket = await firebaseHandler.updateTicket(ticketId, userId, teamId, 'closed');
  return {
    text: `Ticket #${ticket.ticketNumber}closed.`,
  };
};

// Change ticket status
exports.SOLVE = async ({
  isAdmin, ticketNumber, ticketId, teamId, userId,
}) => {
  if (isAdmin) {
    await firebaseHandler.updateTicket(ticketId, userId, teamId, 'solved');
    return {
      text: `Solving ticket #${ticketNumber}`,
    };
  }
};

exports.UNSOLVE = async ({
  isAdmin, ticketNumber, ticketId, teamId, userId,
}) => {
  if (!isAdmin) {
    await firebaseHandler.updateTicket(ticketId, userId, teamId, 'open');
    return {
      text: `Nope. # ${ticketNumber}isn't solved`,
    };
  }
};

// Delete ticket in response to DELETE action button from open ticket confiramtiom ticketText
exports.DELETE = ticketId =>
  // await firebaseHandler.removeOneTicket(ticketId)
  ({
    text: 'Ticket deleted',
  });
