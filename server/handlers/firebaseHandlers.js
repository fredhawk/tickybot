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
    .orderByChild('team_status')
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
exports.getTicketByNumber = async num => {
  const tickets = firebase.database().ref('tickets/');
  const values = await tickets
    .orderByChild('ticketNumber')
    .equalTo(num)
    .once('value');
  return values.val();
};

/**
 * Get ticketId by ticket number
 * 
 * @param {any} num 
 * @returns {string}
 */
exports.getTicketIdByNumber = async num => {
  const tickets = firebase.database().ref('tickets/');
  const values = await tickets
    .orderByChild('ticketNumber')
    .equalTo(num)
    .once('value');
  const val = await values.val();
  const key = await Object.keys(val)[0];
  return key;
};

/**
 * Get authorId based on ticketId
 * 
 * @param {string} id 
 * @returns {string} authorId
 */
exports.getAuthorByTicketId = async id => {
  const ticketRef = firebase.database().ref(`tickets/${id}`);
  const values = await ticketRef.once('value');
  return values.val().author;
};

/**
 * Get teamId based on ticketId
 * 
 * @param {string} id 
 * @returns {string} teamId
 */
exports.getTeamByTicketId = async id => {
  const ticketRef = firebase.database().ref(`tickets/${id}`);
  const values = await ticketRef.once('value');
  return values.val().team;
};

/**
 * Update ticket status
 * 
 * @param {number} ticketnum 
 * @param {string} status 
 */
exports.updateTicket = async (ticketId, authorId, teamId, newStatus) => {
  const ticketRef = firebase.database().ref(`tickets/${ticketId}`);
  ticketRef.update({
    status: newStatus,
    author_status: `${authorId}_${newStatus}`,
    team_status: `${teamId}_${newStatus}`,
  });
  const values = await ticketRef.once('value');
  return values.val();
};
