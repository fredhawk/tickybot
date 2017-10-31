const responses = require('../utils/responses');
const { sendMessage } = require('../handlers/responseHandlers');

module.exports = async (req, res) => {
  res.status(200).end();

  const {
    callback_id: callbackId,
    user: { id: userId, name: username },
    team: { id: teamId },
    response_url: responseURL,
    actions: [{ name: actionType, value: data }],
  } = res.locals.payload;

  /*
  Determine admin status (https://api.slack.com/methods/users.info)
  const isAdmin = (await getUserInfo(user_id)).is_admin;
  const isAdmin = userInfo.is_admin
  */
  const isAdmin = true;

  const responseParams = {
    isAdmin,
    callbackId,
    userId,
    username,
    teamId,
    actionType,
    data, // ticketText or ticketId
  };

  const response = await responses[actionType](responseParams);

  sendMessage(responseURL, response);
};
