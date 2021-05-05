const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const db = require('../config/mysql-config.js')

exports.signup = (req, res, next) => {
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
				db.query(`
				INSERT INTO users (firstName, LastName, email, password) 
				VALUES ("${firstName}", "${lastName}", "${email}", "${hash}")`,
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

	try {
		let reqEmail = req.body.email
		let password = req.body.password
		let isOk = true
		let checkSpecialCaractere = /^[^@&"'`~^#{}<>_=\[\]()!:;,?./§$£€*\+]+$/
		let checkSpecialCaractereForEmail = /^[^&"'`~^#{}<>_=\[\]()!:;,?/§$£€*\+]+$/
	
		//CTRL formulaire cote server
		if (!checkSpecialCaractereForEmail.test(reqEmail)) isOk = false
		if (!checkSpecialCaractere.test(password)) isOk = false
	
		if (isOk) {
			db.query(`
				SELECT email,id,password
				 FROM users 
				WHERE email = '${reqEmail}'`,
				function (error, results, fields) {
					if (error) {
						res.status(401).json({ error: 'User not found !' })
					} else if (results == null | results[0] == undefined) {
						res.status(401).json({ error: 'User not found !' })
					}else {
						bcrypt.compare(password, results[0].password)
							.then(valid => {
								if (!valid) return res.status(401).json({ error: 'Mot de passe incorrect !' })
								res.status(200).json({
									userId: results[0].id,
									token: jwt.sign(
										{ userId: results[0].id },
										`${process.env.TOKEN_SECRET}`,
										{ expiresIn: '6h' }
									)
								})
							})
					}
				})
		} else {
			res.status(400).json({ error: 'Mail ou mot de passe non conforme !' })
		}
	} catch (error) {
		res.status(500).json({ error })
	}

}

exports.isConnect = (req, res, next) => {
	try {
		const token = req.headers.authorization.split(' ')[1]
		const decodedToken = jwt.verify(token, `${process.env.TOKEN_SECRET}`)
		const userId = decodedToken.userId;
		if (req.body.userId && req.body.userId == userId) {
			res.status(200).json(true)
		} else {
			res.status(401).json(false)
		}
	} catch (error) {
		res.status(401).json(false)
	}
}

//TODO AJOUTER: une route isAdmin pour voir si la personne connecter est admin.