const request = require('request-promise-native');

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
