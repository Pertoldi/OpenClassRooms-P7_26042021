const express = require('express')
const router = express.Router()

const userCtrl = require('../controllers/user')
const auth = require('../middleware/auth')
const multer = require('../config/multer-config')

router.post('/signup', userCtrl.signup)
router.post('/signin', userCtrl.signin)
router.post('/isConnect', userCtrl.isConnect)
router.get('/:id', auth, userCtrl.getOneUser)
router.put('/:id', auth, multer, userCtrl.modifyUser)
router.delete('/:id', auth, userCtrl.deleteUser)
router.post('/isAdmin', auth , userCtrl.isAdmin)

module.exports = router