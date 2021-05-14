const express = require('express')
const router = express.Router()

const postCtrl = require('../controllers/post')
const multer = require('../config/multer-config')
const auth = require('../middleware/auth')

router.get('/all', auth, postCtrl.getAllPosts)
router.get('/:id', auth, postCtrl.getOnePost)
router.post('/', auth, multer, postCtrl.addPost)
router.delete('/:id', auth, postCtrl.deletePost)
router.put('/:id', auth, postCtrl.modifyPost)
router.put('/file/:id', auth, multer, postCtrl.modifyPostWithFile)

module.exports = router
