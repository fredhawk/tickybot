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
