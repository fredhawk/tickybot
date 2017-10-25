const responses = require('../utils/responses');
const { sendMessage } = require('../handlers/responseHandlers');

module.exports = async (req, res) => {
  res.status(200).end();

  /*
  Determine admin status (https://api.slack.com/methods/users.info)
  const userInfo = await getUserInfo(user_id);
  const isAdmin = userInfo.is_admin
  */
  const isAdmin = false;

  const {
    callback_id: callbackId,
    team: { id: teamId },
    response_url: responseURL,
    actions: [{ name: actionType, value: ticketNumber }],
  } = res.locals.payload;

  const responseParams = {
    isAdmin,
    callbackId,
    teamId,
    actionType,
    ticketNumber,
  };

  let response = {};

  console.log({ responseParams });

  // let response = { text: 'Test response', replace_original: false };

  if (actionType === 'show') {
    response = {
      replace_original: true,
      ...(await responses.SHOW(responseParams)),
    };
  }
  if (actionType === 'delete') {
    response = {
      replace_original: true,
      ...(await responses.DELETE(ticketNumber)),
    };
  }

  sendMessage(responseURL, response);
};
