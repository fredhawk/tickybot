const handleSlashCommand = require('../controllers/handleSlashCommand');
const handleInteractiveMsg = require('../controllers/handleInteractiveMsg');
const verifyToken = require('../controllers/verifyToken');

module.exports = (app) => {
  // handle input from slash commands
  app.post('/', verifyToken.slash, handleSlashCommand);

  // handle input from interactive messages
  app.post('/actions', verifyToken.interactive, handleInteractiveMsg);
};
