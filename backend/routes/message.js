const express = require('express');
const router = express.Router();

const messageCtrl = require('../controllers/message')
const multer = require('../config/multer-config')
const auth = require('../middleware/auth');
const app = require('../app');

router.get('/:postId', auth, messageCtrl.getComments)
router.delete('/:id', messageCtrl.deleteOneComment)
router.put('/:id', messageCtrl.modifyOneMessage)

module.exports = router
