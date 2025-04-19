
const express = require('express');
const router = express.Router();
const { getUserOrders } = require('../controller/orders-controller');

router.get('/user/:id', getUserOrders);

module.exports = router;