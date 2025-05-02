const express = require('express');
const router = express.Router();

const { productUpload, getAllProducts, updateProduct, softDeleteProduct } = require('../controller/products-controller');

router.post('/add', productUpload);

router.get('/getAll', getAllProducts);

router.put('/update/:id', updateProduct);


router.delete('/delete/:id', softDeleteProduct);






module.exports = router;