const connection = require('../db/db-connection'); 


const getClothing = (req, res) => {
    const showInactive = req.query.showInactive === 'true';
      const sql = showInactive 
        ? 'SELECT * FROM products where category = "clothing"  ' 
        : 'SELECT * FROM products WHERE active = 1 and category = "clothing"';
      
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


}

const getElectronics = (req, res) => {
    const showInactive = req.query.showInactive === 'true';
      const sql = showInactive 
        ? 'SELECT * FROM products where category = "electronics"  ' 
        : 'SELECT * FROM products WHERE active = 1 and category = "electronics"';
      
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

    
}

const getHomeKitchen = (req, res) => {
    const showInactive = req.query.showInactive === 'true';
      const sql = showInactive 
        ? 'SELECT * FROM products where category = "Home & Kitchen"  ' 
        : 'SELECT * FROM products WHERE active = 1 and category = "Home & Kitchen"';
      
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

    
}

const getFootwear = (req, res) => {

    const showInactive = req.query.showInactive === 'true';
      const sql = showInactive 
        ? 'SELECT * FROM products where category = "footwear"  ' 
        : 'SELECT * FROM products WHERE active = 1 and category = "footwear"';
      
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
    
}

const getAccessories = (req, res) => {
    const showInactive = req.query.showInactive === 'true';
      const sql = showInactive 
        ? 'SELECT * FROM products where category = "Accessories"  ' 
        : 'SELECT * FROM products WHERE active = 1 and category = "Accessories"';
      
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

    
}



module.exports ={getClothing, getAccessories, getElectronics, getHomeKitchen, getFootwear}

