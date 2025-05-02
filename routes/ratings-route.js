
const express = require('express');
const router = express.Router();
const { userRatings, getRatingsUser } = require('../controller/ratings-controller');

router.post('/userRatings', userRatings);

router.get('/getUserRatings/:userId', getRatingsUser);



module.exports = router;