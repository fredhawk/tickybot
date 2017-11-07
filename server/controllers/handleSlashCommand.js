const responses = require('../utils/responses');
const { commands } = require('../utils/constants');
const { sendMessage, getUserInfo } = require('../handlers/responseHandlers');
const firebaseHandler = require('../handlers/firebaseHandlers');
const { parseInputText } = require('../utils/helpers');

module.exports = async (req, res) => {
  // Respond quickly according to Slack best practices https://api.slack.com/interactive-messages
  res.status(200).end();

  /**
   * Content from users comes in as req.
   * If no input aside from slash command entered, send HELLO response.
   * Otherwise tokenize input and extract command, optionsl ticket reference and the message and respond accordingly
   * If command not recognized, respond with ERROR response
   */

  const {
    text,
    user_id: userId,
    team_id: teamId,
    user_name: username,
    response_url: responseURL,
  } = req.body;

  const { command, message, number } = parseInputText(text);

  // Construct promises array for initial async calls
  const promises = [getUserInfo(userId)];
  if (number) {
    promises.push(firebaseHandler.getTicketByNumber(number));
  }

  const { isAdmin, ticket } = await Promise.all(promises).then((results) => {
    // Return adin status constructed ticket from new or fetched data
    let ticketEntry;
    if (results[1]) {
      ticketEntry = {
        id: Object.keys(results[1])[0],
        ...Object.values(results[1])[0],
      };
    } else {
      ticketEntry = { number, text: message };
    }
    return {
      ticket: ticketEntry,
      isAdmin: results[0].is_admin,
    };
  });

  // isAdmin = false // for DEVELOPMENT

  const responseParams = {
    command,
    userId,
    username,
    teamId,
    isAdmin,
    ticket,
  };

  const response = await responses[command](responseParams);

  sendMessage(responseURL, response);
};
