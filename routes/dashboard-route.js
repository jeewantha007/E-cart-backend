
const express = require('express');
const router = express.Router();
const { totalUsers, totalOrders, totalProducts, totalRevenue ,totalOrdersMonthly,totalRevenueMonthly} = require('../controller/dashboard-controller');

router.get('/userCount', totalUsers);
router.get('/orderCount', totalOrders);
router.get('/productCount', totalProducts);
router.get('/totalRevenue', totalRevenue);
router.get('/totalOrdersMonthly', totalOrdersMonthly);
router.get('/totalRevenueMonthly', totalRevenueMonthly);


module.exports = router;