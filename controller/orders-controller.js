const connection = require('../db/db-connection');

// Get all orders for a specific user
const getUserOrders = (req, res) => {
  const userId = req.params.id;
  
  // Ensure userId is a number
  const parsedUserId = parseInt(userId);
  if (isNaN(parsedUserId)) {
    return res.status(400).json({ error: "Invalid user ID" });
  }

  const query = `
    SELECT * FROM orders
    WHERE user_id = ?`;

  connection.query(query, [parsedUserId], (err, results) => {
    if (err) {
      console.error("Error fetching user orders:", err);
      return res.status(500).json({ error: "Database error" });
    }
    return res.status(200).json(results);
  });
};

module.exports = { getUserOrders };