const responses = require('../utils/responses');
const { sendMessage } = require('../handlers/responseHandlers');

module.exports = (req, res) => {
  res.status(200).end();
  const { payload } = res.locals;

  const response = { text: 'Test response', replace_original: false };

  sendMessage(payload.response_url, response);
};
