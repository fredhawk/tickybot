const handleSlashCommand = require('../controllers/handleSlashCommand');
const handleInteractiveMsg = require('../controllers/handleInteractiveMsg');
const verifyToken = require('../controllers/verifyToken');

module.exports = (app) => {
  // Handle slash commands input
  app.post('/', verifyToken.slash, handleSlashCommand);

  // Handle interactive messages input
  app.post('/actions', verifyToken.interactive, handleInteractiveMsg);
};
