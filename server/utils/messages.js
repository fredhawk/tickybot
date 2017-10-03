const actions = require('./actions');

module.exports = {
  hello({ tickets, isRestricted }) {
    // map and show list of pending/solved tickets, together with available actions
    let visibleTickets = '';
    tickets.forEach((ticket) => {
      visibleTickets += `${ticket}\n`;
    });

    // hello message for  restricted users showinf lists of their solved (but not closed) and pending tickets
    if (isRestricted) {
      return {
        attachments: [
          {
            title: 'Your open tickets',
            title_link: 'https://ourwebsite.commmm',
            fields: [
              {
                title: 'Solved',
                value:
                  visibleTickets ||
                  'You have no open tickets. See usage examples to open a new one.',
              },
              {
                title: 'Pending',
                value: 'Pending tickets here',
              },
            ],
          },
          {
            title: 'Usage',
            text: 'Instructions or usage examples here',
          },
        ],
      };
    }
    // show all open tickets to unrestricted users (owner/admin)
    return {
      attachments: [
        {
          title: 'Open tickets',
          text: visibleTickets || 'There are no open tickets! :fiesta-parrot: :success-bunny:',
        },
      ],
    };
  },
};
