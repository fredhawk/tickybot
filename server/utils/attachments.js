const { examples } = require('./constants');


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
exports.show = (isAdmin, tickets, userId) => {
/*


TODO



*/

  // If no tickets in database
  if (!tickets) {
    return {
      text: 'No tickets to show. Yay',
    };
  }

  // Filter tickets to show TODO
  const teamOpenTickets = [];
  const openUserTickets = [];
  const solvedUserTickets = [];

  Object.values(tickets).forEach((ticket) => {
    if (isAdmin && ticket.status === 'open') teamOpenTickets.push(ticket);
    else if (ticket.status === 'open' && ticket.author === userId) {
      openUserTickets.push(ticket);
    } else if (ticket.status === 'solved' && ticket.author === userId) {
      solvedUserTickets.push(ticket);
    }
  });

  // FIXME format visible ticket
  const format = arr =>
    arr
      .map(ticket => `#${ticket.number} - ${ticket.text}${isAdmin ? ` from ${ticket.username}` : ''}`)
      .join('\n');

  if (isAdmin) {
    return {
      title: 'All open tickets',
      text: format(teamOpenTickets),
    };
  }
  return {
    title: 'Your Tickets',
    title_link: 'https://www.ticketbot.commm',
    callback_id: 'ticket-select',
    fields: [
      {
        title: 'Solved',
        value: format(solvedUserTickets) || 'No solved tickets',
      },
      {
        title: 'Pending',
        value: format(openUserTickets) || 'No open tickets. Hooray!',
      },
    ],
  };
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
