const connection = require('../db/db-connection'); 


const userRatings = (req ,res) => {
    const { productId, userId, statusType, status } = req.body;

  if (!['favorite', 'dislike'].includes(statusType)) {
    return res.status(400).send('Invalid status type');
  }

  const query = `
    INSERT INTO ratings (product_id, user_id, status_type, status)
    VALUES (?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE status = ?;
  `;

  connection.query(query, [productId, userId, statusType, status, status], (err, result) => {
    if (err) {
      console.error('Error updating product status:', err);
      return res.status(500).send('Internal server error');
    }
    res.status(200).send(`${statusType} status updated successfully`);
  });




}


const getRatingsUser = (req, res) => {
    const userId = req.params.userId; 
  
    const query = `
      SELECT * FROM ratings WHERE user_id = ?
    `;
  
    connection.query(query, [userId], (err, result) => {
      if (err) {
        console.error('Error fetching ratings:', err);
        return res.status(500).send('Internal server error');
      }
  
      res.status(200).json(result);
    });
  };
  


module.exports = {userRatings ,getRatingsUser};