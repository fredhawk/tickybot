const { examples } = require('./constants');

exports.usage = isAdmin => ({
  title: 'Usage',
  text: isAdmin ? examples.admin : examples.user,
  mrkdwn_in: ['text'],
});

exports.status = (isAdmin) => {
  const tickets = Array(5)
    .fill()
    .map((el, i) => `Ticket #${i + 1}`);

  if (isAdmin) {
    return {
      title: 'All open tickets',
      text: tickets.join('\n'),
    };
  }
  return {
    title: 'Your Tickets',
    title_link: 'https://www.ticketbot.commm',
    fields: [
      {
        title: 'Solved',
        value: tickets.join('\n'),
      },
      {
        title: 'Pending',
        value: tickets.join('\n'),
      },
    ],
  };
};

// TODO
exports.actions = () => {};
exports.options = () => {};
