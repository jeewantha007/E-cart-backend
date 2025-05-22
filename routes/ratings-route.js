const express = require('express');
const router = express.Router();

const { submtRatings, fetchRatings, fetchRatingsbyId } = require('../controller/ratings-controller')

router.post('/submit', submtRatings);

router.get('/getAll', fetchRatings);

router.get('/getEach/:product_id', fetchRatingsbyId);


module.exports = router;