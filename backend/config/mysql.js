const mysql = require("mysql");

//Connexion à la base de données
const db = mysql.createConnection({
	host: `${process.env.DB_HOST}`,
	user: `${process.env.DB_USER}`,
	password: `${process.env.DB_PWD}`,
	database: `${process.env.DB_DATABASE}`,
	charset: `utf8`
})

//test de connexion
db.connect((err) => {
	if (err) {
		console.log('Connexion à Mysql échouée !');
		throw err
	}
	console.log('Connexion à MySQL réussi !')
})

module.exports = db