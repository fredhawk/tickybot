const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const server = app.listen(3000, () => {
  console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);
});

app.post('/', (req, res) => {
  // Content from user comes in as req
  const message = req.body.text;

  const data = {
    // Send message so it is only visible to the user.
    response_type: 'ephemeral',
    text: 'Working'
  };
  // Send message back to the user.
  res.json(data);
});
