const { examples } = require('./constants');

exports.usage = isAdmin => ({
  title: 'Usage',
  text: isAdmin ? examples.admin : examples.user,
  mrkdwn_in: ['text'],
});

exports.show = (isAdmin = false, tickets) => {
  // FIXME format visible tickets
  const formattedTickets = Object.values(tickets)
    .map(ticket => `#${ticket.ticketNumber} - ${ticket.text} from @${ticket.username}`)
    .join('\n');

  // Construct ticket menu attachments
  const options = Object.keys(tickets).map(id => ({ text: tickets[id].text, value: id }));

  if (isAdmin) {
    return {
      title: 'All open tickets',
      text: formattedTickets,
    };
  }
  return {
    title: 'Your Tickets',
    title_link: 'https://www.ticketbot.commm',
    callback_id: 'ticket-select',
    fields: [
      {
        title: 'Solved',
        value: formattedTickets,
      },
      {
        title: 'Pending',
        value: formattedTickets,
      },
    ],
    actions: [
      {
        name: 'ticket-list',
        text: 'Pick a ticket',
        type: 'select',
        options,
      },
    ],
  };
};

exports.confirmOpen = (ticketNumber, message) => ({
  text: `Ticket #${ticketNumber} - ${message} submitted.`,
  callback_id: 'open_confirmation',
  atatchemnt_type: 'default',
  actions: [
    {
      name: 'delete',
      text: 'Delete',
      style: 'danger',
      type: 'button',
      value: ticketNumber,
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
