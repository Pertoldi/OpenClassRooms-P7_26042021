const express = require('express');
const router = express.Router();

const likeCtrl = require('../controllers/like')
const auth = require('../middleware/auth');

router.get('/:postId', auth, likeCtrl.getLikes)
router.post('/', auth,  likeCtrl.createLike)


module.exports = router
