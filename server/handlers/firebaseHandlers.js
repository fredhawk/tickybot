const firebase = require('firebase');
require('../../config/firebase');
const querybase = require('querybase');

/**
 * Increase ticket count
 * 
 */
const ticketIncrement = async () => {
  await firebase
    .database()
    .ref('tickets/')
    .child('count')
    .transaction(curr => (curr || 0) + 1);
};

/**
 * Get amount of tickets
 * 
 * @returns {number}
 */
const getTicketCount = async () => {
  const count = firebase.database().ref('tickets/count');
  const num = await count.once('value');
  return num.val();
};

/**
 * Add new ticket
 * 
 * @param {any} userId 
 * @param {any} teamId 
 * @param {any} username 
 * @param {any} text 
 * @param {any} isAdmin 
 * @param {string} [status='open'] 
 * @returns {number} ticketnumber
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
  await ticketIncrement();
  const ticketNumber = await getTicketCount();
  const newTicket = await tickets.push();
  await newTicket.set({
    author: userId,
    team: teamId,
    username,
    text,
    isAdmin,
    ticketNumber,
    status,
    author_status: `${userId}_${status}`,
    team_status: `${teamId}_${status}`,
  });
  return ticketNumber;
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

/**
 * Get all open tickets based on teamId
 * 
 * @param {any} teamId 
 * @returns {collection of tickets}
 */
exports.getAllOpenTicketsByTeam = async teamId => {
  const tickets = firebase.database().ref('tickets/');
  const values = await tickets
    .orderByChild('author_status')
    .equalTo(`${teamId}_open`)
    .once('value');
  return values.val();
};

/**
 * Get a specific ticket based on ticketnumber
 * 
 * @param {any} ticketnumber
 * @returns {object}
 */
exports.getTicketByNumber = async ticketnum => {
  const tickets = firebase.database().ref('ticket/');
  const values = await tickets
    .orderByChild('ticketNumber')
    .equalTo(6)
    .once('value');
  return values;
};

exports.updateTicket = async (userId, ticketId, ticketObj) => {
  const ticket = firebase.database().ref(`ticket/${ticketId}/`);
};
