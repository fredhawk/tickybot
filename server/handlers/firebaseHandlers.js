const firebase = require('firebase');
require('../../config/firebase');

/**
 * Add User
 * 
 * @param {any} userId 
 * @param {any} username 
 */
exports.addUser = (userId, username) => {
  firebase
    .database()
    .ref(`users/${userId}`)
    .set({
      username,
    });
};

/**
 * Add Ticket
 * 
 * @param {any} userId 
 * @param {any} text 
 */
exports.addNewTicket = async (userId, text) => {
  const tickets = firebase.database().ref('tickets/');
  const newTicket = tickets.push();
  newTicket.set({
    author: userId,
    text,
  });
};

/**
 * Remove all ticket
 * 
 * @returns {Array of tickets}
 */
exports.removeAllTickets = () => {
  const tickets = firebase.database().ref('tickets/');
  tickets.remove();
  return tickets.on('child_removed', data => console.log(data));
};

/**
 * Get all tickets
 * 
 * @returns {Array of tickets}
 */
exports.getAllTickets = async () => {
  const tickets = firebase.database().ref('tickets/');
  const values = await tickets.once('value');
  return values.val();
};
