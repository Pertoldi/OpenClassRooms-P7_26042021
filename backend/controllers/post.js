const db = require('../config/mysql-config.js')

exports.getAllPosts = (req, res, next) => {
	//renvoie la liste des posts avec (id, auteur (id, nom, prénom, img), date, titre, url, decription) //les ids sont à enregistrer pour modifier/supprimer
	//La gestion des images n'est pas encore faite.
	db.query('SELECT posts.id, users.id AS userId, users.firstName, users.lastName, users.photo_URL AS userUrl, posts.date, posts.url, posts.title, posts.description FROM posts JOIN users ON users.id = posts.userId;', (error, results, fields) => {
		if (error) res.status(400).json({ error })
		res.status(200).json({ results })

	})
}

exports.addPost = (req, res, next) => {
	console.log('req.body.data is :', req.body.data)
	console.log('req.body is :', req.body);
	console.log('file is :', req.file);
	console.log(req.data);
	console.log(req.body.image);
	// const postObject = JSON.parse(req.body)
	// console.log('postObject is :', postObject)
	res.status(200).json('requete recu !')

}