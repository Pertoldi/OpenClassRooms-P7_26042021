const db = require('../config/mysql-config.js')

exports.getComments = (req, res, next) => {
	const postId = req.params.postId

	db.query(`SELECT content , userId , id FROM comments WHERE (postId = "${postId}");`, (error, results, fields) => {
		if (error) {
			res.status(400).json({ error })
		} else {
			res.status(200).json({results})
		}
	})
}

exports.deleteOneComment = (req, res, next) => {
	const id = req.params.id

	db.query(`DELETE FROM comments WHERE id = '${id}'`, (error, results, fields) => {
		if (error) {
			res.status(400).json({ error })
		} else {
			res.status(200).json('Message delete !')
		}
	})
}