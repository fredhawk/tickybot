const msg = require('../utils/messages');
const verifyToken = require('../middleware/verifyToken');
const handleInput = require('../controllers/handleInput');

module.exports = (app) => {
  app.post('/', verifyToken, (req, res) => {
    // Content from user comes in as req
    const input = req.body.text;

    // TODO determine if user is owner/admin (https://api.slack.com/methods/users.info)
    const isRestricted = true; // TEMP regular user, false for admins/owners

    // fetch tickets
    const tickets = Array(4)
      .fill()
      .map((el, i) => `Ticket${i}`);

    // if input empty, return hello response. Otherwise handle input
    if (!input) {
      res.json(msg.hello({ tickets, isRestricted }));
    } else {
      // if non-empty input found
      handleInput({ input, isRestricted });
    }
  });
};

// req.body structure
// { token: '...',
//   team_id: '...',
//   team_domain: '...',
//   channel_id: '....',
//   channel_name: 'directmessage',
//   user_id: '...',
//   user_name: 'soon depreciated!',
//   command: '/ticket',
//   text: 'msg msg :P',
//   response_url: 'https://hooks.slack.com/commands/.....',
//   trigger_id: '249....247....a56....' }
