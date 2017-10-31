const responses = require('../utils/responses');
const { commands } = require('../utils/constants');
const { sendMessage, getUserInfo } = require('../handlers/responseHandlers');
const firebaseHandler = require('../handlers/firebaseHandlers');

module.exports = async (req, res) => {
  res.status(200).end();

  /*
  Content from users comes in as req.
  If no input other than /ticket given, assign HELLO action
  which returns default response with usage instructions and ticket status ???
  Otherwise tokenize input, parse input into command and a message
  and determine the appropriate action to take.
  If command not recognized treat entire input as a ticket message for users,
  but return ERROR to admins.
  */

  const {
    text,
    user_id: userId,
    team_id: teamId,
    user_name: username,
    response_url: responseURL,
  } = req.body;

  let command = '';
  let ticketText = '';
  let response = {};
  let ticketNumber = null;
  let ticketId = null;
  let ticketStatus = null;
  let ticketAuthor = null;
  let ticketTeam = null;

  // Construct promises array for initial async calls
  const promises = [getUserInfo(userId)];

  // Find ticket reference in #[number] format
  const ticketReference = text.match(/#\d+/g);
  if (ticketReference) {
    // Extract and convert ticketNumber to number type. Push to promises array
    ticketNumber = +ticketReference[0].substring(1);
    promises.push(firebaseHandler.getTicketByNumber(ticketNumber));
  }

  Promise.all(promises).then(async (result) => {
    // const isAdmin = result[0].is_admin;
    const isAdmin = true;
    if (result[1]) {
      [ticketId] = Object.keys(result[1]);
      ({
        text: ticketText,
        status: ticketStatus,
        author: ticketAuthor,
        team: ticketTeam,
      } = result[1][ticketId]);
    }

    if (!text) {
      response = await responses.HELLO({ isAdmin, teamId, userId });
    } else {
      let tokenized = text.match(/\S+/g);
      command = tokenized[0].toUpperCase();

      if (ticketReference) {
        tokenized = tokenized.filter(token => token !== ticketReference[0]);
      }

      const responseParams = {
        userId,
        username,
        teamId,
        isAdmin,
        ticketNumber,
        ticketId,
        ticketAuthor,
        ticketText,
        ticketStatus,
        ticketTeam,
      };

      if (commands.includes(command)) {
        ticketText = ticketText || tokenized.splice(1).join(' ');
        response = await responses[command]({ ...responseParams, ticketText });
      } else if (!isAdmin) {
        ticketText = tokenized.join(' ');
        response = await responses.OPEN({ ...responseParams, ticketText });
      } else {
        response = await responses.ERROR({ isAdmin });
      }
    }

    console.log({
      ticketText,
      isAdmin,
      command,
      ticketNumber,
      ticketId,
      // response,
      // request: req.body,
    });

    sendMessage(responseURL, response);
  });
};
