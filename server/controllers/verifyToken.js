// check if the correct token is received from slack request
module.exports = (req, res, next) => {
  if (req.body.token === process.env.SLACK_TOKEN) next();
  else console.log('Incorrect token received');
};
