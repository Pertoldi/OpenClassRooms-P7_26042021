const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const fs = require('fs')

const db = require('../config/mysql-config.js')
const { json } = require('body-parser')

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
					} else {
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

exports.getOneUser = (req, res, next) => {
	db.query(`SELECT firstName, lastName, photo_URL FROM users WHERE id = ${req.params.id}`, (error, result, field) => {
		if (error) {
			res.status(400).json({ error })
		} else {
			res.status(200).json(result)
		}
	})
}

exports.modifyUser = (req, res, next) => {

	reqObject = JSON.parse(req.body.data)

	if (req.file == undefined) {
		db.query(`UPDATE users SET firstName = '${reqObject.firstName}', lastName = '${reqObject.lastName}'  WHERE id = ${req.params.id};`, (error, results, fields) => {
			if (error) {
				res.status(400).json({ error })
			} else {
				res.status(200).json('User modifiee !')
			}
		})
	} else {//SI on a un fichier on supprime l'ancien (si != null) et on enregistre le nouveau
		db.query(`SELECT photo_URL FROM users WHERE id = ${req.params.id};`, (error, results, fields) => {
			if (error) {
				res.status(400).json({ error })
			} else {
				let url = results[0].photo_URL
				if (url != null) {
					url = url.split('/')
					url = url[url.length - 1]
					fs.unlink(`images/${url}`, (err) => {
						if (err) throw err;
						console.log('Ancienne image -> successfully deleted !');
					})
				}
				const newUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
				db.query(`UPDATE users SET firstName = '${reqObject.firstName}', lastName = '${reqObject.lastName}', photo_URL = '${newUrl}'  WHERE id = ${req.params.id};`, (error, results, fields) => {
					if (error) {
						fs.unlink(`images/${req.file.filename}`,
							(err) => {
								if (err) throw err
							})
						res.status(400).json({ error })
					} else {
						res.status(200).json('User modifiee !')
					}
				})
			}
		})


	}
	//
}

exports.deleteUser = (req, res, next) => {
	db.query(`SELECT photo_Url FROM users  WHERE id = ${req.params.id}`, (error, result, field) => {
		if (error) {
			throw error
		} else {
			console.log(result);
			userUrl = result[0].photo_Url
			console.log('userUrl is :', userUrl)
			if (userUrl != null) {//On doit supprimer la photo de profil si il y en a une
				let imageURL = userUrl.split('/')
				imageURL = imageURL[imageURL.length - 1]
				fs.unlink(`images/${imageURL}`, (error) => {
					if (error) {
						throw error
					}
				})
			}
			db.query(`DELETE FROM users WHERE id = ${req.params.id}`, (error, result, field) => {
				if (error) {
					res.status(400).json({ error })
				} else {
					res.status(200).json('Utilisateur supprimé !')
				}
			})
		}
	})
}

exports.isAdmin = (req, res, next) => {
	userId = JSON.parse(req.body.userId)
	// on recoit userId
	db.query(`SELECT isAdmin FROM users WHERE id = ${userId};`, (error, result, field) => {
		if (error) {
			res.status(400).json({ error })
		} else {
			let isAdmin = false
			if (result[0].isAdmin == "1") {
				isAdmin = true
			}
			res.status(200).json({ isAdmin })
		}
	})
}
