const connection = require('../db/db-connection'); 

const totalUsers = (req , res) => {
    const query = "SELECT COUNT(*) AS total FROM user";

    connection.query(query, (err, result) => {
      if (err) {
        console.error("Error fetching total users:", err);
        return res.status(500).json({ error: "Database error" });
      }
  
      const total = result[0].total;
      res.json({ totalUsers: total });
    });



}


const totalOrders = (req , res) => {
    const query = "SELECT COUNT(*) AS total FROM orders";

    connection.query(query, (err, result) => {
      if (err) {
        console.error("Error fetching total orders:", err);
        return res.status(500).json({ error: "Database error" });
      }
  
      const total = result[0].total;
      res.json({ totalOrders: total });
    });
  
}

const totalProducts = (req , res) => {

    const query = "SELECT COUNT(*) AS total FROM products WHERE active = 1";

    connection.query(query, (err, result) => {
      if (err) {
        console.error("Error fetching total products:", err);
        return res.status(500).json({ error: "Database error" });
      }
  
      const total = result[0].total;
      res.json({ totalProducts: total });
    });
  

}

const totalRevenue = (req , res) => {

    const query = "SELECT SUM(paid_amount) AS totalRevenue FROM payments";

    connection.query(query, (err, result) => {
      if (err) {
        console.error("Error fetching total revenue:", err);
        return res.status(500).json({ error: "Database error" });
      }
  
      const total = result[0].totalRevenue || 0;
      res.json({ totalRevenue: total });
    });
  



}

module.exports = {totalUsers , totalOrders , totalProducts, totalRevenue}