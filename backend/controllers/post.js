const db = require('../config/mysql-config.js')

exports.getAllPosts = (req, res, next) => {
	//renvoie la liste des posts avec (id, auteur (id, nom, prénom, img), date, titre, url, decription) //les ids sont à enregistrer pour modifier/supprimer
	//La gestion des images n'est pas encore faite.
	db.query('SELECT posts.id, users.id AS userId, users.firstName, users.lastName, users.photo_URL AS userUrl, posts.date, posts.url AS postUrl, posts.title, posts.description FROM posts JOIN users ON users.id = posts.userId ORDER BY posts.date DESC;', (error, results, fields) => {
		if (error) res.status(400).json({ error })
		res.status(200).json({ results })
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