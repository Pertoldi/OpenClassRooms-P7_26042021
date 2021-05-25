//auth pour authentification
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
	try {
		const token = req.headers.authorization.split(' ')[1]
		const decodedToken = jwt.verify(token, `${process.env.TOKEN_SECRET}`)
		const userId = decodedToken.userId
		reqUserId = String(req.body.userId)									//on utilise String pour être sur que le type n'interfere pas dans la conditon suivante
		if (req.body.userId && reqUserId !== String(userId)) { 		//Si on a un userId dans le corps de la requête et que celui-ci est différent de l'userId du token
			throw 'Invalid user ID'
		} else {
			next()																
		}
	} catch (error) {
		res.status(401).json({ error: 'Requête non authentifiée !' })  // si il y a une erreur envoie l'erreur, si un pb sans erreur renvoyé -> req non authentifié
	}
}