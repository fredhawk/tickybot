const attach = require('./attachments');
const firebaseHandler = require('../handlers/firebaseHandlers');
const { status } = require('../utils/constants');
const { sendDM } = require('../handlers/responseHandlers');

/**
 * Message responses based on intial slash commands or interactive messages
 * @param {object} responseParams from handleSlashCommand OR handleInteractiveMsg
 * @param {bool} object.isAdmim - Admin status of a user
 * @param {string} obj.command - Initial slash command OR interactive button command
 * @param {object} obj.ticket - An existing ticket referenced in a slash command OR a new ticket from OPEN slash command
 * @param {string} obj.userId
 * @param {string} obj.teamId
 * @param {string} obj.data - Data received from an interactive message. Can be a new ticket text OR an existing ticket id
 */

// Show open and/or pending tickets and usage instructions
exports.HELLO = async params => ({
  text: ':wave: Hello',
  attachments: [await attach.show(params), attach.usage(params.isAdmin)],
});

// Show usage instructions
exports.HELP = ({ isAdmin }) => ({
  resplace_original: false,
  text: 'Need help? Here are some exmaples:',
  attachments: [attach.usage(isAdmin)],
});

// Show open tickets to admins and open/solved to users
exports.SHOW = async params => ({
  resplace_original: false,
  attachments: [await attach.show(params)],
});

// Response to unrecognized inputs
exports.ERROR = ({ isAdmin }) => ({
  text: "I don't understand.. :thinking_face: \n Check some usage examples below:",
  attachments: [attach.usage(isAdmin)],
});

// INITIAL SLASH COMMAND RESPONSES

exports.OPEN = async ({ isAdmin, command, ticket }) =>
  !isAdmin && ticket.text && { attachments: [attach.confirm(command, ticket)] };

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
  let msg = null;
  let ticketNumber = null;
  if (command === 'OPEN') {
    ticketNumber = await firebaseHandler.addNewTicket({
      userId,
      teamId,
      username,
      text: data.charAt(0).toUpperCase() + data.slice(1), // uppercase first letter
      isAdmin,
    });
    msg = `Ticket #${ticketNumber} submitted: ${data}`;
  } else {
    const { number } = await firebaseHandler.updateTicket(data, userId, teamId, status[command]);
    msg = `Ticket #${number} is now ${status[command]}.`;
    if (command === 'SOLVE') sendDM(userId, ticketNumber);
  }

  return {
    resplace_original: true,
    text: msg,
  };
};
