const express = require('express')
const router = express.Router()

const messageCtrl = require('../controllers/message')
const auth = require('../middleware/auth');

router.get('/:postId', auth, messageCtrl.getComments)
router.delete('/:id', auth, messageCtrl.deleteOneComment)
router.put('/:id', auth, messageCtrl.modifyOneMessage)
router.post('/:postId/:userId', auth, messageCtrl.createNewMessage)

module.exports = router
