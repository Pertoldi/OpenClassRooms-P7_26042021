const express = require('express');
const router = express.Router();

const postCtrl = require('../controllers/post')
const multer = require('../config/multer-config')
const auth = require('../middleware/auth');

router.get('/all', postCtrl.getAllPosts)
router.post('/', auth, multer, postCtrl.addPost)

module.exports = router
