const db = require('../config/mysql-config.js')

exports.getComments = (req, res, next) => {
	const postId = req.params.postId

	db.query(`SELECT content , userId , id FROM comments WHERE (postId = "${postId}");`, (error, results, fields) => {
		if (error) {
			res.status(400).json({ error })
		} else {
			res.status(200).json({ results })
		}
	})
}

exports.deleteOneComment = (req, res, next) => {
	const id = req.params.id

	db.query(`DELETE FROM comments WHERE id = '${id}';`, (error, results, fields) => {
		if (error) {
			res.status(400).json({ error })
		} else {
			res.status(200).json('Message delete !')
		}
	})
}

exports.modifyOneMessage = (req, res, next) => {
	const id = req.params.id

	db.query(`UPDATE comments SET content = '${req.body.content}' WHERE id = ${id};`, (error, results, fields) => {
		if (error) {
			res.status(400).json({ error })
		} else {
			res.status(200).json('Message modifiee !')
		}
	})
}

exports.createNewMessage = (req, res, next) => {
	const postId = req.params.postId
	const userId = req.params.userId

	db.query(`INSERT INTO comments (postId, userId, content) VALUES ('${postId}', '${userId}', '${req.body.content}')`, (error, results, fields) => {
		if (error) {
			res.status(400).json({ error })
		} else {
			res.status(200).json('Message cree !')
		}
	})
}
