const firebaseHandler = require('../handlers/firebaseHandlers');

module.exports = app =>
  app.post('/', async (req, res) => {
    // Content from user comes in as req
    const { user_id, user_name, text } = req.body;
    const userResult = await firebaseHandler.addUser(user_id, user_name);
    const ticketResult = await firebaseHandler.addNewTicket(user_id, text);
    const tickets = await firebaseHandler.getAllTickets();
    const data = {
      // Send message so it is only visible to the user.
      response_type: 'ephemeral',
      text: 'Working',
    };
    // Send message back to the user.
    res.json(data);
  });
