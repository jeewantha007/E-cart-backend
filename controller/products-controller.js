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
    const { name, description, price, category, qty } = req.body;
    const image = req.file ? req.file.filename : null; // File path of uploaded image (can store in DB)

    // Validate the inputs
    if (!name || !price || !category || !qty) {
      return res.status(400).json({ message: 'Product name, price, category and quantity are required' });
    }

    // SQL query to insert product data (including image path) into the database
    const query = `
      INSERT INTO products (name, description, price, category, image, qty)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    // Execute the SQL query to insert data
    connection.query(query, [name, description, price, category, image, qty], (error, results) => {
      if (error) {
        return res.status(500).json({ message: 'Error saving product to database', error: error });
      }

      // Successfully added product
      res.status(201).json({ message: 'Product added successfully', productId: results.insertId });
    });
  });
};


const getAllProducts = (req, res) => {
    const showInactive = req.query.showInactive === 'true';
    const sql = showInactive 
      ? 'SELECT * FROM products' 
      : 'SELECT * FROM products WHERE active = 1';
  
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


const updateProduct = (req, res) => {
  // Apply multer to upload the image
  upload.single('image')(req, res, (err) => {
    if (err) {
      return res.status(500).json({ message: 'Error uploading image', error: err });
    }

    // Extract product ID from route params instead of body
    const productId = req.params.id; // Make sure your route has this parameter
    const { name, description, price, category, qty } = req.body;
    const image = req.file ? req.file.filename : null;

    // Log received data for debugging
    console.log('Received data:', {
      productId,
      name,
      description,
      price,
      category,
      qty,
      hasImage: !!image
    });

    // Validate the inputs
    if (!productId || !name || !price || !category || !qty) {
      return res.status(400).json({ 
        message: 'Product ID, name, price, category and quantity are required',
        received: {
          productId: productId || 'missing',
          name: name || 'missing',
          price: price || 'missing',
          category: category || 'missing',
          qty: qty || 'missing'
        }
      });
    }

    // Begin building the SQL query
    let query = `
      UPDATE products
      SET name = ?, description = ?, price = ?, category = ?, qty = ?
    `;
    const params = [name, description, price, category, qty];

    // If there's a new image, include it in the update query
    if (image) {
      query += `, image = ?`;
      params.push(image);
    }

    // Complete the SQL query to match the product ID
    query += ` WHERE id = ?`;
    params.push(productId);

    // Execute the SQL query to update the product in the database
    connection.query(query, params, (error, results) => {
      if (error) {
        return res.status(500).json({ message: 'Error updating product in database', error: error });
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({ message: 'Product not found' });
      }

      // Successfully updated the product
      res.status(200).json({ 
        message: 'Product updated successfully',
        productId: productId
      });
    });
  });
};
  

const softDeleteProduct = (req, res) => {
  const productId = req.params.id;
  
  if (!productId) {
    return res.status(400).json({ message: 'Product ID is required' });
  }

  const deactivateQuery = 'UPDATE products SET active = 0 WHERE id = ?';
  
  connection.query(deactivateQuery, [productId], (error, results) => {
    if (error) {
      return res.status(500).json({ 
        message: 'Error deactivating product', 
        error: error 
      });
    }
    
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    return res.status(200).json({ 
      message: 'Product has been successfully deactivated',
      productId: productId
    });
  });
};
  
module.exports = { productUpload, getAllProducts, updateProduct, softDeleteProduct };