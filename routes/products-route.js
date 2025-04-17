const express = require('express');
const router = express.Router();

const { productUpload, getAllProducts } = require('../controller/products-controller');

router.post('/add', productUpload);

router.get('/getAll', getAllProducts);



module.exports = router;