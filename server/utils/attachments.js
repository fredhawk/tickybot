const { examples } = require('./constants');

exports.usage = isAdmin => ({
  title: 'Usage',
  text: isAdmin ? examples.admin : examples.user,
  mrkdwn_in: ['text'],
});

exports.show = (isAdmin = false, tickets) => {
  // FIXME format visible tickets
  const formattedTickets = Object.values(tickets)
    .map(ticket => `${ticket.text} from @${ticket.author}`)
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

// TODO
exports.actions = () => {};
exports.options = () => {};
