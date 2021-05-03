const express = require('express');
const router = express.Router();

const postCtrl = require('../controllers/post')

router.get('/all', postCtrl.getAllPosts)

module.exports = router
