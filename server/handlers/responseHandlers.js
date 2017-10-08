const request = require('request');

exports.sendMessage = (responseURL, message) => {
  const options = {
    uri: responseURL,
    method: 'POST',
    headers: { 'Content-type': 'application-json' },
    json: message,
  };

  request(options, (error, response, body) => {
    if (error) console.log(error);
  });
};
