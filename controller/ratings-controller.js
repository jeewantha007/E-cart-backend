const connection = require('../db/db-connection');

const submtRatings = (req, res) => {
  const { product_id, user_id, rating } = req.body;

  if (!product_id || !rating) {
    return res.status(400).json({ error: "product_id and rating are required" });
  }

  connection.query(
    'INSERT INTO Ratings (product_id, user_id, rating) VALUES (?, ?, ?)',
    [product_id, user_id || null, rating],
    (error, results) => {
      if (error) {
        console.error("Error inserting rating:", error);
        return res.status(500).json({ error: "Failed to submit rating" });
      }
      res.status(201).json({ message: "Rating submitted successfully" });
    }
  );
};


const fetchRatingsbyId = (req, res) => {
  const { product_id } = req.params;

  if (!product_id) {
    return res.status(400).json({ error: "product_id is required" });
  }

  const sql = `SELECT user_id, rating, created_at FROM Ratings WHERE product_id = ?`;

  connection.query(sql, [product_id], (error, results) => {
    if (error) {
      console.error("Error fetching ratings:", error);
      return res.status(500).json({ error: "Failed to fetch ratings" });
    }

    const formatted = results.map(r => ({
      user_id: r.user_id,
      rating: r.rating,
      created_at: r.created_at,
   
    }));

    res.status(200).json(formatted);
  });
};






const fetchRatings = (req, res) => {
  const sql = `
    SELECT 
      p.*, 
      COALESCE(ROUND(AVG(r.rating)), 0) AS averageRating
    FROM Products p
    LEFT JOIN Ratings r ON p.id = r.product_id
    GROUP BY p.id
  `;

  connection.query(sql, (error, results) => {
    if (error) {
      console.error("Error fetching products with ratings:", error);
      return res.status(500).json({ error: "Failed to fetch products" });
    }
    res.status(200).json(results);
  });
};



module.exports ={submtRatings ,fetchRatings,fetchRatingsbyId}