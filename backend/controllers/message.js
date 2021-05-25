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
	const content = req.body.content

	//CTRL formulaire cote server
	let isOk = true
	let checkSpecialCaractere = /^[^@&~#{}<>_=\[\]/§$*\+]+$/
	if (!checkSpecialCaractere.test(content)) isOk = false

	if (isOk) {
		db.query(`UPDATE comments SET content = '${req.body.content}' WHERE id = ${id};`, (error, results, fields) => {
			if (error) {
				res.status(400).json({ error })
			} else {
				res.status(200).json('Message modifiee !')
			}
		})
	} else {
		res.status(400).json({ message: 'Il y a une erreur dans les données !' })
	}
}

exports.createNewMessage = (req, res, next) => {
	const postId = req.params.postId
	const userId = req.params.userId
	const content = req.body.content

	//CTRL formulaire cote server
	let isOk = true
	let checkSpecialCaractere = /^[^@&~#{}<>_=\[\]/§$*\+]+$/
	if (!checkSpecialCaractere.test(content)) isOk = false

	if (isOk) {
		db.query(`INSERT INTO comments (postId, userId, content) VALUES ('${postId}', '${userId}', '${req.body.content}')`, (error, results, fields) => {
			if (error) {
				res.status(400).json({ error })
			} else {
				res.status(200).json('Message cree !')
			}
		})
	} else {
		res.status(400).json({ message: 'Il y a une erreur dans les données !' })
	}
}
