const firebase = require('firebase');
require('../../config/firebase');
const querybase = require('querybase');

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
exports.addNewTicket = async (
  userId,
  teamId,
  username,
  text,
  isAdmin,
  status = 'open'
) => {
  const tickets = firebase.database().ref('tickets/');
  const newTicket = tickets.push();
  newTicket.set({
    author: userId,
    team: teamId,
    username,
    text,
    isAdmin,
    status,
    author_status: `${userID}_${status}`,
    // ticketNumber,
  });
};

/**
 * Remove all ticket
 * 
 */
exports.removeAllTickets = () => {
  const tickets = firebase.database().ref('tickets/');
  tickets.remove();
};

/**
 * Get all open tickets
 * 
 * @returns {collection of tickets}
 */
exports.getAllOpenTickets = async () => {
  const tickets = firebase.database().ref('tickets/');
  const values = await tickets
    .orderByChild('status')
    .equalTo('open')
    .once('value');
  return values.val();
};

/**
 * Get all open tickets based on userId
 * 
 * @param {any} userId 
 * @returns {collection of tickets}
 */
exports.getAllOpenTicketsByUser = async userId => {
  const tickets = firebase.database().ref('tickets/');
  const values = await tickets
    .orderByChild('author_status')
    .equalTo(`${userId}_open`)
    .once('value');
  return values.val();
};

exports.ticketCount = async () => {
  const tickets = firebase.database().ref('tickets/');
  tickets.on('child_added', snap => {
    snap.count = snap.count + 1;
    console.log(snap);
  });
  // const values = await tickets.once('value');
  // const count = await va.numChildren();
  // values.
  console.log(count);
  return count;
};

/**
 * Get a specific ticket based on userId and ticketnumber
 * 
 * @param {any} userId 
 * @param {any} ticketId 
 * @returns {object}
 */
exports.getTicket = async (userId, ticketId) => {
  const ticket = firebase.database().ref(`ticket/${ticketId}/`);
  const value = await ticket.once('value');
  // value
  return value.val();
};

exports.updateTicket = async (userId, ticketId, ticketObj) => {
  const ticket = firebase.database().ref(`ticket/${ticketId}/`);
};
