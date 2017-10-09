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

  if (isAdmin) {
    return {
      title: 'All open tickets',
      text: formattedTickets,
    };
  }
  return {
    title: 'Your Tickets',
    title_link: 'https://www.ticketbot.commm',
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
  };
};

// TODO
exports.actions = () => {};
exports.options = () => {};
