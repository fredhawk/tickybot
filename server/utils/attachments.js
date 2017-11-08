const firebaseHandler = require('../handlers/firebaseHandlers');
const { msg } = require('../utils/helpers');

/**
 * @param {bool} isAdmin - Admin status
 */
exports.usage = isAdmin => ({
  color: '#36a64f',
  title: msg.help.att.title,
  text: isAdmin ? msg.help.att.admin : msg.help.att.user,
});

/**
 * @param {bool} isAdmin - Admin status
 * @param {array} tickets - An array of prefetced tickets
 * @param{string} userId
 */
exports.show = ({ isAdmin, userId, teamId }) => {
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
        return { text: msg.show.list.empty };
      }

      // FIXME format visible ticket
      const format = arr =>
        arr
          .map(ticket =>
            `*#${ticket.number}* ${ticket.text}${isAdmin ? ` from <@${ticket.author}>` : ''}`)
          .join('\n');

      const base = {
        mrkdwn_in: ['text', 'fields'],
        color: '#36a64f',
      };

      if (isAdmin) {
        return {
          ...base,
          title: msg.show.title.adminTitle,
          text: format(ticketsOpen),
        };
      }
      return {
        ...base,
        title: msg.show.title.userTitle,
        title_link: 'https://www.ticketbot.commm',
        fields: [
          {
            title: msg.show.title.userSolved,
            value: format(ticketsSolved) || 'No solved tickets.',
          },
          {
            title: msg.show.title.userOpen,
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
  color: '#F4511E',
  mrkdwn_in: ['text', 'actions'],
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
      text: msg.btn.view,
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
  const { id, text } = ticket;
  return {
    color: '#ffd740',
    text: msg.confirm.text(command, ticket),
    mrkdwn_in: ['text', 'actions'],
    callback_id: `CONFIRM_${command}`,
    attachment_type: 'default',
    actions: [
      {
        name: 'CANCEL',
        text: msg.btn.no,
        style: 'danger',
        type: 'button',
        value: 'cancel',
      },
      {
        name: command,
        text: msg.btn.yes(command),
        type: 'button',
        value: id || text, // id is only undefined when OPENing a new ticket
      },
    ],
  };
};
