const firebase = require('firebase');

exports.writeUserData = (userId, name, text) => {
  firebase
    .database()
    .ref(`users/${userId}`)
    .set({
      username: name,
      text,
    });
};

exports.addUser = (userId, name, text) => {
  firebase
    .database()
    .ref('users/')
    .push()
    .set({
      userId,
      username: name,
      text,
    });
};
exports.addNewTicket = (userId, text) => {
  const newTicket = firebase
    .database()
    .ref('tickets/')
    .push();

  newTicket.set({
    userId,
    text,
  });
};
