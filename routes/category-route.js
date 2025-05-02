
const express = require('express');
const router = express.Router();
const { getClothing, getElectronics, getHomeKitchen, getFootwear, getAccessories } = require('../controller/category-controller');

router.get('/clothing', getClothing );
router.get('/electronics', getElectronics );
router.get('/home-kitchen', getHomeKitchen );
router.get('/footwear', getFootwear );
router.get('/accessories', getAccessories );

module.exports = router;