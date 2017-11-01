const responses = require('../utils/responses');
const { sendMessage } = require('../handlers/responseHandlers');
const { commands } = require('../utils/constants');

module.exports = async (req, res) => {
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

  /*
  Determine admin status (https://api.slack.com/methods/users.info)
  const isAdmin = (await getUserInfo(user_id)).is_admin;
  const isAdmin = userInfo.is_admin
  */
  const isAdmin = false;

  const responseParams = {
    isAdmin,
    callbackId,
    userId,
    username,
    teamId,
    command,
    data, // ticket text or id
  };

  // Determine appropriate response
  let response = null;
  if (command === 'CANCEL' || command === 'HELP' || command === 'SHOW') {
    response = await responses[command](responseParams);
  } else {
    response = await responses.CONFIRM(responseParams);
  }

  sendMessage(responseURL, response);
};
