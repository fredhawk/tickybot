const responses = require('../utils/responses');
const { commands } = require('../utils/constants');
const { sendMessage, getUserInfo } = require('../handlers/responseHandlers');

module.exports = async (req, res) => {
  res.status(200).end();
  const {
    user_id, team_id, user_name, text, response_url,
  } = req.body;
  // TODO determine user status (https://api.slack.com/methods/users.info)
  const userInfo = await getUserInfo(user_id);
  // const isAdmin = userInfo.is_admin
  const isAdmin = false;

  // Example of how to use firebase handlers
  // const userResult = await firebaseHandler.addUser(user_id, user_name);
  // const ticketResult = await firebaseHandler.addNewTicket(user_id, text);
  // const tickets = await firebaseHandler.getAllTickets();

  /*
  Content from users comes in as req.
  If no input other than /ticket given, assign HELLO action
  which returns default response with usage instructions and ticket status ???
  Otherwise tokenize input, parse input into command and a message
  and determine the appropriate action to take.
  If command not recognized treat entire input as a ticket message for users,
  but return ERROR to admins.
  */

  let command = '';
  let message = '';
  let ticketNumber = null;
  let response = {};

  if (!text) {
    response = await responses.HELLO({ isAdmin });
  } else {
    let tokenized = text.match(/\S+/g);
    command = tokenized[0].toUpperCase();

    // Find ticket reference - format #[number]
    const ticketReference = text.match(/#\d+/g);
    if (ticketReference) {
      ticketNumber = ticketReference[0].substring(1);
      tokenized = tokenized.filter(token => token !== ticketReference[0]);
    }

    if (commands.includes(command)) {
      message = tokenized.splice(1).join(' ');
      response = await responses[command]({
        isAdmin,
        user_id,
        command,
        message,
        ticketNumber,
      });
    } else if (!isAdmin) {
      message = tokenized.join(' ');
      response = await responses.OPEN({ user_id, message });
    } else {
      response = await responses.ERROR({ isAdmin });
    }
  }

  console.log({
    isAdmin,
    message,
    response,
    user_id,
    command,
    ticketNumber,
    request: req.body,
  });

  sendMessage(response_url, response);
};
