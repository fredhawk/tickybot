const responses = require('../utils/responses');
const { commands } = require('../utils/constants');
const { sendMessage, getUserInfo } = require('../handlers/responseHandlers');

module.exports = async (req, res) => {
  res.status(200).end();

  const {
    text,
    user_id: userId,
    team_id: teamId,
    user_name: username,
    response_url: responseURL,
  } = req.body;

  /*
  Determine user status (https://api.slack.com/methods/users.info)
  const userInfo = await getUserInfo(user_id);
  const isAdmin = userInfo.is_admin
  */
  const isAdmin = false;

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

    // Find ticket reference in #[number] format
    const ticketReference = text.match(/#\d+/g);
    if (ticketReference) {
      ticketNumber = ticketReference[0].substring(1);
      tokenized = tokenized.filter(token => token !== ticketReference[0]);
    }

    const responseParams = {
      userId,
      username,
      teamId,
      isAdmin,
      ticketNumber,
    };

    if (commands.includes(command)) {
      message = tokenized.splice(1).join(' ');
      response = await responses[command]({ ...responseParams, message });
    } else if (!isAdmin) {
      message = tokenized.join(' ');
      response = await responses.OPEN({ ...responseParams, message });
    } else {
      response = await responses.ERROR({ isAdmin });
    }
  }

  // console.log({
  //   message,
  //   isAdmin,
  //   command,
  //   ticketNumber,
  //   response,
  //   request: req.body,
  // });

  sendMessage(responseURL, response);
};
