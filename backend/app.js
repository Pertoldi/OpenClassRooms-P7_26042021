const express = require('express')

//Ces paquets sont là pour la sécurité
const helmet = require('helmet')
const toobusy = require('toobusy-js');
const bouncer = require('express-bouncer')(500, 10000, 5)
require('dotenv').config()

const userRoutes = require('./routes/user');

const app = express()
app.use(express.json())	//On indique que les échanges se fonds en JSON

//sécurité de l'app
app.use(helmet())										//Pour la sécurité: XSS filter, contentSecurityPolicy, frameguard, noSniff etc... (voir: https://helmetjs.github.io/)
app.use(function (req, res, next) {				//Pour éviter les attaque (D)DoS: block les requetes quand le server est trop occupé
	if (toobusy()) {
		 res.status(503).send('Server Too Busy');
	} else {
		 next();
	}
});
bouncer.blocked = function (req, res, next, remaining) {		//Attaques par force brute : il s'agit ici du message d'erreur, voir les routes protégées dans ./routes
	res.status(429).send('Too many requests have been made, ' + 'please wait ' + remaining / 1000 + ' seconds');
};

//CORS headers
app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');// http://127.0.0.1:4200 on autorise que les requetes localhosts, idealement https://nomDomaine.com
	res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
	next();
});

app.use('/auth/', userRoutes);

module.exports = app