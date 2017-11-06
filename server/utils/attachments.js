const { examples } = require('./constants');
const firebaseHandler = require('../handlers/firebaseHandlers');

/**
 * @param {bool} isAdmin - Admin status
 */
exports.usage = isAdmin => ({
  title: 'Usage',
  text: isAdmin ? examples.admin : examples.user,
  mrkdwn_in: ['text'],
});

/**
 * @param {bool} isAdmin - Admin status
 * @param {array} tickets - An array of prefetced tickets
 * @param{string} userId
 */
exports.show = async ({ isAdmin, userId, teamId }) => {
  let promises = null;
  if (isAdmin) {
    promises = [firebaseHandler.getAllOpenTicketsByTeam(teamId)];
  } else {
    promises = [
      firebaseHandler.getAllOpenTicketsByUser(userId),
      firebaseHandler.getAllSolvedTicketsByUser(userId),
    ];
  }

  return Promise.all(promises)
    .then((tickets) => {
      const ticketsOpen = Object.values(tickets[0]);
      const ticketsSolved = tickets[1] && Object.values(tickets[1]);

      // If no tickets in database
      if (!ticketsOpen && !ticketsSolved) {
        return {
          text: 'No tickets to show. Yay',
        };
      }

      // FIXME format visible ticket
      const format = arr =>
        arr
          .map(ticket =>
            `*#${ticket.number}* ${ticket.text}${isAdmin ? ` from <@${ticket.author}>` : ''}`)
          .join('\n');

      if (isAdmin) {
        return {
          mrkdwn_in: ['text'],
          title: 'All open tickets',
          text: format(ticketsOpen),
        };
      }
      return {
        mrkdwn_in: ['text', 'fields'],
        title: 'Your Tickets',
        title_link: 'https://www.ticketbot.commm',
        fields: [
          {
            title: 'Solved',
            value: format(ticketsSolved) || 'No solved tickets.',
          },
          {
            title: 'Pending',
            value: format(ticketsOpen) || 'No open tickets. Woohoo!',
          },
        ],
      };
    })
    .catch(console.log);
};

/**
 * @param {bool} isAdmin -  admin status
 * @param {string} message
 * @returns {object} Response message
 */
exports.helpOrShowInteractive = (isAdmin, message) => ({
  text: message,
  callback_id: 'helpOrShow',
  attachemnt_type: 'default',
  actions: [
    {
      name: 'HELP',
      text: 'Help',
      type: 'button',
      value: 'help',
    },
    {
      name: 'SHOW',
      text: isAdmin ? 'View open tickets' : 'View my tickets',
      type: 'button',
      value: 'show',
    },
  ],
});

/**
 * @param {string} command - Initial slash command
 * @param {object} ticket: {id, text, number} - Ticket referenced in a slash command
 * @returns {object} Constructed attachment to send with a response message
 */
exports.confirm = (command, ticket) => {
  const { id, text, number } = ticket;
  // Determine response message
  const msg =
    command === 'OPEN'
      ? `Submit ticket with text: ${text}?`
      : `${command} ticket #${number}: ${text}?`;

  return {
    text: msg,
    callback_id: `CONFIRM_${command}`,
    attachment_type: 'default',
    actions: [
      {
        name: 'CANCEL',
        text: 'Cancel',
        style: 'danger',
        type: 'button',
        value: 'cancel',
      },
      {
        name: command,
        text: command === 'UNSOLVE' ? 'REOPEN' : command,
        type: 'button',
        value: id || text, // id is only undefined when OPENing a new ticket
      },
    ],
  };
};
