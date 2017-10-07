module.exports = (app) => {
  require('./auth')(app);
  require('./commands')(app);
  require('./actions')(app);
};
