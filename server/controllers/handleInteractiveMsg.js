const responses = require('../utils/responses');
const { sendMessage, getUserInfo } = require('../handlers/responseHandlers');

module.exports = async (req, res) => {
  // Respond quickly according to Slack best practices https://api.slack.com/interactive-messages
  res.status(200).end();

  /**
   * Input from action buttons.
   * Detect appropriate response by actions.name property and respond accordingly
   */
  const {
    callback_id: callbackId,
    user: { id: userId, name: username },
    team: { id: teamId },
    response_url: responseURL,
    actions: [{ name: command, value: data }],
  } = res.locals.payload;

  // FOR DEVELOPMETN: Comment fetch and set isAdmin manually
  // const isAdmin = (await getUserInfo(userId)).is_admin;
  const isAdmin = true;

  const responseParams = {
    isAdmin,
    callbackId,
    userId,
    username,
    teamId,
    command,
    data, // contains existing ticket id OR new ticket text
  };

  // Determine and call an appropriate response
  let response = null;
  if (command === 'CANCEL' || command === 'HELP' || command === 'SHOW') {
    response = await responses[command](responseParams);
  } else {
    response = await responses.CONFIRM(responseParams);
  }

  sendMessage(responseURL, response);
};
