const request = require('request-promise-native');

exports.sendMessage = (responseURL, message) => {
  const options = {
    uri: responseURL,
    method: 'POST',
    headers: { 'Content-type': 'application-json' },
    json: message,
  };
  request(options).catch(err => console.log({ err }));
};

// Requires USERS.PROFILE scope in Slack app permissions
exports.getUserInfo = (UserId) => {
  const data = {
    token: process.env.SLACK_BOT_OAUTH_TOKEN,
    user: UserId,
  };
  return request
    .post('https://slack.com/api/users.info', { form: data })
    .then(res => JSON.parse(res).user)
    .catch(err => console.log({ err }));
};
