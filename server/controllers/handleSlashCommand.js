const responses = require('../utils/responses');
const { commands } = require('../utils/constants');
const { sendMessage, getUserInfo } = require('../handlers/responseHandlers');
const firebaseHandler = require('../handlers/firebaseHandlers');

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

  let command = '';
  let ticket = {};
  let response = {};
  let num = null;

  // Construct promises array for initial async calls
  const promises = [getUserInfo(userId)];

  /**
   * Parse the input for possible ticket reference in #[number] format.
   * If reference found, fetch existing ticket data
   */
  const ticketReference = text.match(/#\d+/g);
  if (ticketReference) {
    num = +ticketReference[0].substring(1);
    promises.push(firebaseHandler.getTicketByNumber(num));
  }

  Promise.all(promises)
    .then(async (result) => {
      // FOR DEVELOPMETN: Comment fetch and set isAdmin manually
      // const isAdmin = result[0].is_admin;
      const isAdmin = true;

      /*
      If input referenced an existing ticket within the team, assign data to ticket object.
      Otherwise, only assign referenced number for use in ERROR message
      */
      if (result[1]) {
        [ticket] = Object.values(result[1]);
        [ticket.id] = Object.keys(result[1]);
      } else ticket.number = num;

      // Send HELLO response if no input text detected
      if (!text) {
        response = await responses.HELLO({ isAdmin, teamId, userId });
      } else {
        let tokenized = text.match(/\S+/g);
        command = tokenized[0].toUpperCase();

        if (ticketReference) {
          tokenized = tokenized.filter(token => token !== ticketReference[0]);
        }

        const responseParams = {
          command,
          userId,
          username,
          teamId,
          isAdmin,
          ticket,
        };

        // Determine appropriate response
        if (commands.includes(command)) {
          ticket.text = ticket.text || tokenized.splice(1).join(' ');
          response = await responses[command](responseParams);
        } else if (!isAdmin) {
          responseParams.command = 'OPEN';
          ticket.text = ticket.text || tokenized.join(' ');
          response = await responses.OPEN(responseParams);
        }

        response = response || (await responses.ERROR({ isAdmin }));
      }

      console.log({
        ticket,
        isAdmin,
        command,
        response,
        request: req.body,
      });

      sendMessage(responseURL, response);
    })
    .catch(console.log);
};
