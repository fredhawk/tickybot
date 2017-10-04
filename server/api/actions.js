const verifyToken = require('../middleware/verifyToken');

// handle clicked actions here
module.exports = (app) => {
  app.post('/actions', verifyToken, (req, res) => {
    console.log(req.body);
    res.json({});
  });
};
