const request = require('request-promise-native');

/**
 * Requires USERS.PROFILE scope in Slack app permissions
 * @param {string} userId
 */
exports.getUserInfo = (userId) => {
  const data = {
    token: process.env.SLACK_BOT_OAUTH_TOKEN,
    user: userId,
  };
  return request
    .post('https://slack.com/api/users.info', { form: data })
    .then(res => JSON.parse(res).user)
    .catch(err => console.log({ err }));
};

/**
 * Notofies user when their ticket is solved
 * REQUIRES chat:write, im:read, post, read scopes at
 * @param {string} userId
 * @param {string} message - Message text to send to the user
 */
exports.sendDM = async (userId, ticketNumber) => {
  // Get ticket owner's direct message channel id
  const imList = await request.post('https://slack.com/api/im.list', {
    form: { token: process.env.SLACK_BOT_OAUTH_TOKEN },
  });
  const userChannelId = JSON.parse(imList).ims.find(channel => channel.user === userId).id;

  request.post('https://slack.com/api/chat.postMessage', {
    form: {
      id: 'ticket-solved',
      as_user: false,
      text: `Your ticket #${ticketNumber} has been solved. `,
      token: process.env.SLACK_BOT_OAUTH_TOKEN,
      channel: userChannelId,
    },
  });
};

/**
 * @param {string} responseURL - received from slack messages
 * @param {string} message - Constructed response message with attachment
 */
exports.sendMessage = (responseURL, message) => {
  const options = {
    uri: responseURL,
    method: 'POST',
    headers: { 'Content-type': 'application-json' },
    json: message,
  };
  request(options).catch(err => console.log({ err }));
};
