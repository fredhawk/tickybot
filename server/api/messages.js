const handleSlashCommand = require('../controllers/handleSlashCommand');
const verifyToken = require('../controllers/verifyToken');

module.exports = (app) => {
  app.post('/', verifyToken, handleSlashCommand);

  // TODO
  // handle inputs from actions buttons and option picker interactive messages
  app.post('/actions', verifyToken);
  app.post('/options', verifyToken);
};
