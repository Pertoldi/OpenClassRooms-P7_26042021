const db = require('../config/mysql-config.js')

exports.getLikes = (req, res, next) => {
	const postId = req.params.postId
	//On récupère le nom et le prénom des personnes qui ont likés, le nb de row donne le total de like du post
	db.query(`SELECT users.firstName, users.lastName FROM likes JOIN users ON likes.userId = users.id  WHERE likes.postId = ${postId};`, (error, results, fields) => {
		if (error) {
			res.status(400).json({ error })
		} else {
			res.status(200).json({ results })
		}
	})
}

exports.createLike = (req, res, next) => {
	const postId = req.body.postId
	const userId = req.body.userId
	let isAlredadyLiked = false

	//On cherche à savoir si l'utilisateur à déjà liké le post
	db.query(`SELECT userId FROM likes WHERE postId = ${postId};`, (error, results, fields) => {
		if (error) {
			res.status(400).json({ error })
		} else {
			if (results.length == 0) {													// Si il n'y a aucun like on ajoute le like

				db.query(`INSERT INTO likes (userId, postId) VALUES (${userId}, ${postId})`, (error, results, fields) => {
					if (error) {
						res.status(400).json({ error })
					} else {
						res.status(200).json('Like ajouté !')
					}
				})
			} else {
				for (let i = 0; i < results.length; i++) {						//On cherche a savoir si l'utilisateur à déjà liker le post
					if (results[i].userId == userId) {
						isAlredadyLiked = true
					}
				}
				if (isAlredadyLiked) {													//Si c'est le cas on retire le like
					db.query(`DELETE FROM likes WHERE userId=${userId} and postId=${postId}`, (error, results, fields) => {
						if (error) {
							res.status(400).json({ error })
						} else {
							res.status(200).json('Like retiré !')
						}
					})
				} else {																		//Sinon on ajoute le like
					db.query(`INSERT INTO likes (userId, postId) VALUES (${userId}, ${postId})`, (error, results, fields) => {
						if (error) {
							res.status(400).json({ error })
						} else {
							res.status(200).json('Like ajouté !')
						}
					})
				}
			}
		}
	})

}
