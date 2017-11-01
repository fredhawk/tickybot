const { examples } = require('./constants');

exports.usage = isAdmin => ({
  title: 'Usage',
  text: isAdmin ? examples.admin : examples.user,
  mrkdwn_in: ['text'],
});

exports.show = (isAdmin = false, tickets, userId) => {
  // // Construct ticket menu attachments
  // const options = Object.keys(tickets).map(id => ({
  //   text: `#${tickets[id].ticketNumber} - ${tickets[id].text}`,
  //   value: id,
  // }));

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
        value: format(openUserTickets) || 'No open tickets. Hooray!',
      },
    ],
  };
};

exports.helpOrShowInteractive = (isAdmin, text) => ({
  text,
  callback_id: 'helpOrShow',
  atatchemnt_type: 'default',
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

exports.confirmOpen = message => ({
  text: `Submit ticket with text: ${message}?`,
  callback_id: 'open_confirmation',
  atatchment_type: 'default',
  actions: [
    {
      name: 'CANCEL_OPEN',
      text: 'Cancel',
      style: 'danger',
      type: 'button',
      value: 'cancel',
    },
    {
      name: 'CONFIRM_OPEN',
      text: 'Submit',
      type: 'button',
      value: message,
    },
  ],
});

exports.confirmClose = (ticketNumber, ticketId) => ({
  text: `Close ticket #${ticketNumber}?`,
  callback_id: 'close_confirmation',
  atatchment_type: 'default',
  actions: [
    {
      name: 'CANCEL_CLOSE',
      text: 'Cancel',
      style: 'danger',
      type: 'button',
      value: 'cancel',
    },
    {
      name: 'CONFIRM_CLOSE',
      text: 'Close ticket',
      type: 'button',
      value: ticketId,
    },
  ],
});

exports.confirmSolve = (ticketNumber, ticketId, ticketText) => ({
  text: `Solve ticket #${ticketNumber}: ${ticketText}?`,
  callback_id: 'close_confirmation',
  atatchment_type: 'default',
  actions: [
    {
      name: 'CANCEL_SOLVE',
      text: 'Cancel',
      style: 'danger',
      type: 'button',
      value: 'cancel',
    },
    {
      name: 'CONFIRM_SOLVE',
      text: 'Solve ticket',
      type: 'button',
      value: ticketId,
    },
  ],
});
  ],
});

exports.confirmUnsolve = (ticketNumber, ticketId, ticketText) => ({
  text: `Reopen ticket #${ticketNumber}: ${ticketText}?`,
  callback_id: 'unsolve_confirmation',
  atatchment_type: 'default',
  actions: [
    {
      name: 'CANCEL_UNSOLVE',
      text: 'Cancel',
      style: 'danger',
      type: 'button',
      value: 'cancel',
    },
    {
      name: 'CONFIRM_UNSOLVE',
      text: 'Reopen ticket',
      type: 'button',
      value: ticketId,
    },
  ],
});