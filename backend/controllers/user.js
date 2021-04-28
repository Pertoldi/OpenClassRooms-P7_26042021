const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const db = require('../config/mysql.js')

exports.signup = (req, res, next) => {
	console.log(req);
	let firstName = req.body.firstName
	let lastName = req.body.lastName
	let email = req.body.email
	let password = req.body.password
	let isOk = true
	let messageError = ''
	let checkSpecialCaractere = /^[^@&"'`~^#{}<>_=\[\]()!:;,?./§$£€*\+]+$/
	let checkSpecialCaractereForEmail = /^[^&"'`~^#{}<>_=\[\]()!:;,?/§$£€*\+]+$/

	//CTRL formulaire cote server
	if (password.split("") < 8) {							//On veut une taille minimum de 8 char pour le password
		isOk = false
		messageError = "Mot de passe trop court !"
	} if (!checkSpecialCaractere.test(lastName)) {
		isOk = false
		messageError += "Nom invalide ! "
	} if (!checkSpecialCaractere.test(firstName)) {
		isOk = false
		messageError += "Prenom invalide ! "
	} if (!checkSpecialCaractere.test(password)) {
		isOk = false
		messageError += "Il ne faut pas de caractère spécial pour le mot de passe ! "
	} if (!checkSpecialCaractereForEmail.test(email)) {
		isOk = false
		messageError += "mail invalide ! "
	}

	if (isOk) {
		bcrypt.hash(password, 10)
			.then((hash) => {
				db.query(`INSERT INTO users (firstName, LastName, email, password) VALUES ("${firstName}", "${lastName}", "${email}", "${hash}")`,
					function (error, results, fields) {
						if (error) {
							res.status(400).json({ error })
						} else {
							res.status(201).json({ message: 'Utilisateur créé !' })
						}
					})
			})
			.catch(error => {
				console.log('Une erreur est survenu avec bcrypt !')
				throw error
			})
	} else {
		res.status(400).json({ error: messageError })
	}
}

exports.signin = (req, res, next) => {
	let email = req.body.email
	let password = req.body.password
	let isOk = true
	let checkSpecialCaractere = /^[^@&"'`~^#{}<>_=\[\]()!:;,?./§$£€*\+]+$/
	let checkSpecialCaractereForEmail = /^[^&"'`~^#{}<>_=\[\]()!:;,?/§$£€*\+]+$/

	//CTRL formulaire cote server
	if (!checkSpecialCaractereForEmail.test(email)) isOk = false
	if (!checkSpecialCaractere.test(password)) isOk = false

	if (isOk) {
		//On cherche l'utilisateur dans la DB puis on bcrypt.compare le password et on envoie le token mélangé à l'id
	} else {
		res.status(400).json({ error: 'Mail ou mot de passe nom valide !' })
	}
}