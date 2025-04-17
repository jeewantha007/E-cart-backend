const express = require('express');
const { userRegister, userLogin, getAllUsers } = require('../controller/user-controller');
const router = express.Router();



router.post('/register',userRegister);
router.post('/login',userLogin);
router.get('/getAll',getAllUsers);



module.exports = router;