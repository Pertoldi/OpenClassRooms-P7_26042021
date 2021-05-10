const db = require('../config/mysql-config.js')
const fs = require('fs')

exports.getAllPosts = (req, res, next) => {
	//renvoie la liste des posts avec (id, auteur (id, nom, prénom, img), date, titre, url, decription) //les ids sont à enregistrer pour modifier/supprimer
	//La gestion des images n'est pas encore faite.
	db.query('SELECT posts.id, users.id AS userId, users.firstName, users.lastName, users.photo_URL AS userUrl, posts.date, posts.url AS postUrl, posts.title, posts.description FROM posts JOIN users ON users.id = posts.userId ORDER BY posts.date DESC;', (error, result, fields) => {
		if (error) res.status(400).json({ error })
		res.status(200).json({ result })
	})
}

exports.getOnePost = (req, res, next) => {
	db.query(`SELECT posts.id AS postId, users.id AS userId, users.firstName, users.lastName, users.photo_URL AS userUrl, posts.date, posts.url AS postUrl, posts.title, posts.description FROM posts JOIN users ON users.id = posts.userId WHERE posts.id = ${req.params.id} ORDER BY posts.date DESC;`, (error, result, field) => {
		if (error) {
			res.status(400).json({ error })
		} else {
			res.status(200).json({ result })
		}
	})
}

exports.addPost = (req, res, next) => {
	const reqObject = JSON.parse(req.body.data)
	const title = reqObject.title
	const description = reqObject.description
	const userId = reqObject.userId
	const url = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`

	db.query(`INSERT INTO posts (userId, date, url, title, description) VALUES (${userId}, NOW(), "${url}", "${title}", "${description}");`,
		(error, results, fields) => {
			if (error) {
				res.status(400).json({ error })
			} else {
				res.status(200).json('Nouveau post creer !')
			}
		})
}

exports.deletePost = (req, res, next) => {
	db.query(`SELECT url FROM posts  WHERE id = ${req.params.id}`, (error, result, field) => {
		if (error) {
			res.status(400).json({ error })
		} else {
			console.log(result[0].url)
			let imageURL = result[0].url.split('/')
			imageURL = imageURL[imageURL.length - 1]
			fs.unlink(`images/${imageURL}`, () => {
				db.query(`DELETE FROM posts WHERE id = ${req.params.id}`, (error, result, field) => {
					if (error) {
						res.status(400).json({ error })
					} else {
						res.status(200).json('Post supprimé !')
					}
				})
			})
		}
	})
}

exports.modifyPost = (req, res, next) => {
	const title = req.body.title
	const description = req.body.description

	db.query(`UPDATE posts SET title = '${title}', description = '${description}' WHERE id = ${req.params.id};`, (error, results, fields) => {
		if (error) {
			res.status(400).json({ error })
		} else {
			res.status(200).json('Post modifiee !')
		}
	})

}

exports.modifyPostWithFile = (req, res, next) => {//TODO on doit dabord supprimer l'ime avant de la changer
	db.query(`SELECT url FROM posts WHERE id = ${req.params.id}`, (error, results, fields) => {
		if (error) {
			res.status(400).json({ error })
		} else {
			let url = results[0].url
			url = url.split('/')
			url = url[url.length - 1]
			fs.unlink(`images/${url}`, (err) => {
				if (err) throw err;
				console.log('Ancienne image -> successfully deleted !');
			})

			const reqObject = JSON.parse(req.body.data)
			const title = reqObject.title
			const description = reqObject.description
			const newUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
		
			db.query(`UPDATE posts SET title = '${title}', description = '${description}', url = '${newUrl}' WHERE id = ${req.params.id};`,
				(error, results, fields) => {
					if (error) {
						res.status(400).json({ error })
					} else {
						res.status(200).json('Post modifiee !')
					}
				})
		}
	})




	//TODO query avec supprésion du fichier + changement de fichier
}