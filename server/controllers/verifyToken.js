// check if the correct token is received from slack request
exports.slash = (req, res, next) => {
  if (req.body.token === process.env.SLACK_TOKEN) next();
  else res.status(403).end('Access forbidden');
};

exports.interactive = (req, res, next) => {
  const payload = JSON.parse(req.body.payload);
  if (payload.token === process.env.SLACK_TOKEN) {
    // Pass parsed payload to the next controller
    res.locals.payload = payload;
    next();
  } else res.status(403).end('Access forbidden');
};
