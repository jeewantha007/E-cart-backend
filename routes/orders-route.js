
const express = require('express');
const router = express.Router();
const { getUserOrders, getAllOrderHistory, getPaymentHistory } = require('../controller/orders-controller');

router.get('/user/:id', getUserOrders);

router.get('/admin', getAllOrderHistory);

router.get('/payments', getPaymentHistory);

module.exports = router;