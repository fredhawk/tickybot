const responses = require('../utils/responses');
const { userCommands, adminCommands } = require('../utils/constants');
const firebaseHandler = require('../handlers/firebaseHandlers');

module.exports = async (req, res, next) => {
  const { user_id, team_id, user_name, text } = req.body;
  // const { text } = req.body;

  // TODO determine user status (https://api.slack.com/methods/users.info)
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
  let response = {};

  if (!text) {
    response = responses.HELLO({ isAdmin });
  } else {
    const tokenized = req.body.text.match(/\S+/g);
    command = tokenized[0].toUpperCase();

    if (isAdmin) {
      // TODO SOLVE command requires ticketId
      response = adminCommands.includes(command)
        ? responses[command]({ isAdmin })
        : responses.ERROR({ isAdmin });
    } else if (userCommands.includes(command)) {
      // TODO CLOSE, UNSOLVE commands require ticketId
      message = tokenized.splice(1).join(' ');
      response = responses[command]({ isAdmin, message });
    } else {
      message = tokenized.join(' ');
      response = responses.OPEN({ message });
    }
  }
  // console.log(req.body);
  // console.log({
  //   isAdmin,
  //   message,
  //   response,
  // });
  await firebaseHandler.addNewTicket(
    user_id,
    team_id,
    user_name,
    text,
    isAdmin
  );
  res.json(response);
};
