const express = require('express');
const router = express.Router();
const bouncer = require('express-bouncer')(500, 10000, 5)
const userCtrl = require('../controllers/user')

router.post('/signup', userCtrl.signup)
router.post('/signin',bouncer.block , userCtrl.signin)
router.post('/isConnect', userCtrl.isConnect)

module.exports = router