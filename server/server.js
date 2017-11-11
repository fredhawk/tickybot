const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const PORT = process.env.PORT || 3000;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

require('./api')(app);

const server = app.listen(PORT, () => {
  console.log(
    'Express server listening on port %d in %s mode',
    server.address().port,
    app.settings.env
  );
});

app.use(express.static(path.join(__dirname, '../dist')));

app.get('/slack', (req, res) => {
  if (!req.query.code) {
    // access denied
    res.redirect('https://tickybott.herokuapp.com/');
    return;
  }
  let data = {
    form: {
      client_id: process.env.SLACK_CLIENT_ID,
      client_secret: process.env.SLACK_SECRET,
      code: req.query.code,
    },
  };
  request.post('https://slack.com/api/oauth.access', data, function(
    error,
    response,
    body
  ) {
    if (!error && response.statusCode == 200) {
      // Get an auth token
      let token = JSON.parse(body).access_token;

      res.redirect(`https://tickybott.herokuapp.com/success.html`);
    }
  });
});

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'index.html'));
});
app.get('/success.html', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'success.html'));
});
