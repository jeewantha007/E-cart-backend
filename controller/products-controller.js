const connection = require('../db/db-connection'); // Adjust as needed
const upload = require('../middleware/multer'); // Import multer
const path = require('path');

// Product upload controller that handles both product data and image upload
const productUpload = (req, res) => {
  // Apply multer to upload the image
  upload.single('image')(req, res, (err) => {
    if (err) {
      return res.status(500).json({ message: 'Error uploading image', error: err });
    }

    // After the image upload, the rest of the product data can be accessed in req.body
    const { name, description, price, category } = req.body;
    const image = req.file ? req.file.filename : null; // File path of uploaded image (can store in DB)

    // Validate the inputs
    if (!name || !price || !category) {
      return res.status(400).json({ message: 'Product name, price, and category are required' });
    }

    // SQL query to insert product data (including image path) into the database
    const query = `
      INSERT INTO products (name, description, price, category, image)
      VALUES (?, ?, ?, ?, ?)
    `;

    // Execute the SQL query to insert data
    connection.query(query, [name, description, price, category, image], (error, results) => {
      if (error) {
        return res.status(500).json({ message: 'Error saving product to database', error: error });
      }

      // Successfully added product
      res.status(201).json({ message: 'Product added successfully', productId: results.insertId });
    });
  });
};


const getAllProducts = (req, res) => {
    const sql = 'SELECT * FROM products';
  
    connection.query(sql, (err, results) => {
      if (err) {
        return res.status(500).json({ message: 'Error fetching products', error: err });
      }
  
      // Format each product's image path
      const formattedProducts = results.map(product => ({
        ...product,
        image: product.image 
          ? `${req.protocol}://${req.get('host')}/images/${product.image}`
          : null
      }));
  
      res.status(200).json(formattedProducts);
    });
  };

module.exports = { productUpload , getAllProducts};
