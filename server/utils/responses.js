const attach = require('./attachments');
const firebaseHandler = require('../handlers/firebaseHandlers');
const { status } = require('../utils/constants');

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
  // TODO Get solved tickets
  const tickets = await firebaseHandler.getAllOpenTicketsByTeam(teamId);
  return {
    resplace_original: false,
    attachments: [attach.show(isAdmin, tickets, userId)],
  };
};

// Response to unrecognized inputs
exports.ERROR = isAdmin => ({
  text: "I don't understand.. :thinking_face: \n Check some usage examples below:",
  attachments: [attach.usage(isAdmin)],
});

// INITIAL SLASH COMMAND RESPONSES

exports.OPEN = async ({ isAdmin, command, ticket }) =>
  !isAdmin && {
    attachments: [attach.confirm(command, ticket)],
  };

exports.CLOSE = async ({
  isAdmin, command, userId, ticket,
}) => {
  if (!isAdmin && ticket.author === userId && ticket.status !== 'closed') {
    return { attachments: [attach.confirm(command, ticket)] };
  } else if (ticket.status === 'closed') {
    return { text: `Ticket #${ticket.number} already closed` };
  }
  return { text: 'Not allowed.', attachments: [attach.usage(isAdmin)] };
};

exports.SOLVE = async ({
  isAdmin, command, ticket, teamId,
}) => {
  if (ticket.team !== teamId) {
    return { text: `Ticket #${ticket.number} doesn't exist in this team.` };
  } else if (ticket.status !== 'open') {
    return { text: `Ticket #${ticket.number} is ${ticket.status}.` };
  } else if (isAdmin) {
    return { attachments: [attach.confirm(command, ticket)] };
  }
};

exports.UNSOLVE = async ({
  isAdmin, command, ticket, teamId,
}) => {
  if (ticket.team !== teamId) {
    return { text: `Ticket #${ticket.number} belongs to another team.` };
  } else if (ticket.status !== 'solved') {
    return { text: `Not allowed. Ticket #${ticket.number} is ${ticket.status}.` };
  } else if (!isAdmin) {
    return { attachments: [attach.confirm(command, ticket)] };
  }
  return { text: 'Not allowed', attachments: [attach.usage(isAdmin)] };
};

// CANCEL ACTION

exports.CANCEL = ({ isAdmin }) => ({
  resplace_original: true,
  attachments: [attach.helpOrShowInteractive(isAdmin, 'Cancelled.')],
});

// CONFIRM ACTION

exports.CONFIRM = async ({
  isAdmin, command, userId, teamId, username, data,
}) => {
  let msg = '';
  if (command === 'OPEN') {
    const ticketNumber = await firebaseHandler.addNewTicket({
      userId,
      teamId,
      username,
      text: data,
      isAdmin,
    });
    msg = `Ticket #${ticketNumber} submitted: ${data}`;
  } else {
    const { number } = await firebaseHandler.updateTicket(data, userId, teamId, status[command]);
    msg = `Ticket #${number} is now ${status[command]}.`;
  }

  return {
    resplace_original: true,
    text: msg,
  };
};
