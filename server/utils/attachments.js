const { examples } = require('./constants');

exports.usage = isAdmin => ({
  title: 'Usage',
  text: isAdmin ? examples.admin : examples.user,
  mrkdwn_in: ['text'],
});

exports.show = (isAdmin = false, tickets, userId) => {
  // Filter tickets to show
  const openTickets = [];
  const openUserTickets = [];
  const solvedUserTickets = [];

  Object.values(tickets).forEach((ticket) => {
    if (isAdmin && ticket.status === 'open') openTickets.push(ticket);
    else if (ticket.status === 'open' && ticket.author === userId) {
      openUserTickets.push(ticket);
    } else if (ticket.status === 'solved' && ticket.author === userId) {
      solvedUserTickets.push(ticket);
    }
  });

  // FIXME format visible ticket
  const format = arr =>
    arr
      .map(ticket =>
        `#${ticket.ticketNumber} - ${ticket.text}${isAdmin ? ` from ${ticket.username}` : ''}`)
      .join('\n');

  // Construct ticket menu attachments
  const options = Object.keys(tickets).map(id => ({
    text: `#${tickets[id].ticketNumber} - ${tickets[id].text}`,
    value: id,
  }));

  if (isAdmin) {
    return {
      title: 'All open tickets',
      text: format(openTickets),
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
        value: format(openUserTickets) || 'no open tickets. Hooray!',
      },
    ],
    // actions: [
    //   {
    //     name: 'ticket-list',
    //     text: 'Pick a ticket',
    //     type: 'select',
    //     options,
    //   },
    // ],
  };
};

exports.confirmOpen = (ticketNumber, ticketId, message) => ({
  text: `Ticket #${ticketNumber} - ${message} submitted.`,
  callback_id: 'open_confirmation',
  atatchemnt_type: 'default',
  actions: [
    {
      name: 'delete',
      text: 'Delete',
      style: 'danger',
      type: 'button',
      value: ticketId,
    },
    {
      name: 'show',
      text: 'View All',
      type: 'button',
      value: 'show',
    },
  ],
});

// TODO
exports.actions = () => {};
exports.options = () => {};
