/* eslint-disable global-require */
module.exports = (app) => {
  require('./auth')(app);
  require('./messages')(app);
};
