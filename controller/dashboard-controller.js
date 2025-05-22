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


const totalOrdersMonthly = (req, res) => {
  const query = `
    SELECT 
      MONTH(created_at) AS month,
      COUNT(*) AS total
    FROM orders
    WHERE YEAR(created_at) = YEAR(CURDATE())
    GROUP BY MONTH(created_at)
    ORDER BY MONTH(created_at);
  `;

  connection.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching monthly orders:", err);
      return res.status(500).json({ error: "Database error" });
    }

    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const labels = [];
    const data = [];

    // Build a map from query results
    const resultMap = new Map();
    results.forEach(row => {
      resultMap.set(row.month, row.total);
    });

    // Fill all 12 months
    for (let i = 1; i <= 12; i++) {
      labels.push(monthNames[i - 1]);
      data.push(resultMap.get(i) || 0); // Default to 0 if not in result
    }

    res.json({ labels, data });
  });
};



const totalRevenueMonthly = (req, res) => {
  const query = `
    SELECT 
      MONTH(paid_at) AS month,
      SUM(paid_amount) AS revenue
    FROM payments
    WHERE YEAR(paid_at) = YEAR(CURDATE())
    GROUP BY MONTH(paid_at)
    ORDER BY MONTH(paid_at);
  `;

  connection.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching monthly revenue:", err);
      return res.status(500).json({ error: "Database error" });
    }

    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const labels = [];
    const data = [];

    const resultMap = new Map();
    results.forEach(row => {
      resultMap.set(row.month, row.revenue);
    });

    for (let i = 1; i <= 12; i++) {
      labels.push(monthNames[i - 1]);
      data.push(resultMap.get(i) || 0);
    }

    res.json({ labels, data });
  });
};



module.exports = {totalUsers , totalOrders , totalProducts, totalRevenue ,totalOrdersMonthly,totalRevenueMonthly}