const attach = require('./attachments');
const firebaseHandler = require('../handlers/firebaseHandlers');
const { newStatus } = require('../utils/constants');
const { msg } = require('../utils/helpers');
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
  text: msg.hello.text,
  mrkdwn_in: ['text', 'attachments'],
  attachments: [await attach.show(params), attach.usage(params.isAdmin)],
});

// Show usage instructions
exports.HELP = ({ isAdmin }) => ({
  resplace_original: false,
  text: msg.help.text,
  mrkdwn_in: ['text', 'attachments'],
  attachments: [attach.usage(isAdmin)],
});

// Show open tickets to admins and open/solved to users
exports.SHOW = async params => ({
  resplace_original: false,
  mrkdwn_in: ['attachments'],
  attachments: [await attach.show(params)],
});

// Response to unrecognized inputs
exports.ERROR = ({ isAdmin }) => ({
  text: msg.error.text,
  mrkdwn_in: ['text', 'attachments'],
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
    return { text: msg.error.closed(ticket.number) };
  }
  return { text: msg.error.notAllowed, attachments: [attach.usage(isAdmin)] };
};

exports.SOLVE = async ({
  isAdmin, command, ticket, teamId,
}) => {
  if (ticket.team !== teamId) {
    return { text: msg.error.badTeam(ticket.number) };
  } else if (ticket.status !== 'open') {
    return { text: msg.error.notAllowedStatus(ticket) };
  } else if (isAdmin) {
    return { attachments: [attach.confirm(command, ticket)] };
  }
};

exports.UNSOLVE = async ({
  isAdmin, command, ticket, teamId,
}) => {
  if (ticket.team !== teamId) {
    return { text: msg.error.badTeam(ticket.number) };
  } else if (ticket.status !== 'solved') {
    return { text: msg.error.notAllowedStatus(ticket) };
  } else if (!isAdmin) {
    return { attachments: [attach.confirm(command, ticket)] };
  }
  return { text: msg.error.notAllowed, attachments: [attach.usage(isAdmin)] };
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
  let text = null;
  if (command === 'OPEN') {
    const number = await firebaseHandler.addNewTicket({
      userId,
      teamId,
      username,
      text: data.charAt(0).toUpperCase() + data.slice(1), // uppercase first letter
      isAdmin,
    });
    text = msg.confirm.submit(number, data);
  } else {
    const { number } = await firebaseHandler.updateTicket(data, userId, teamId, newStatus[command]);
    text = msg.confirm.newStatus(number, command);
    if (command === 'SOLVE') sendDM(userId, number);
  }

  return {
    text,
    resplace_original: true,
    mrkdwn_in: ['text'],
  };
};
