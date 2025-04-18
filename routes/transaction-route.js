// transaction-route.js
const express = require('express');
const router = express.Router();
const { orderTransaction } = require('../controller/transaction-controller');

router.post('/placeOrder', orderTransaction);

module.exports = router;