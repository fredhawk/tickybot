const { actions } = require('../utils/constants');
const msg = require('../utils/messages');

module.exports = ({ input, isRestricted }) => {
  // parse input
  let command = '';
  let message = '';

  // tokenize input
  const tokens = input.match(/\S+/g);
  // match first token(word) against valid commands
  if (Object.keys(actions).includes(tokens[0].toUpperCase())) {
    command = tokens[0].toLowerCase();
    message = tokens.slice(1, tokens.length - 1).join(' ');
  } else {
    message = tokens.join(' ');
  }

  console.log({ command, message });

  // TODO switch actions
};
