const express = require('express')
const path = require("path")


//Ces paquets sont là pour la sécurité
const helmet = require('helmet')
const toobusy = require('toobusy-js');
require('dotenv').config()

//Les routes
const userRoutes = require('./routes/user')
const postRoutes = require('./routes/post')
const messageRoutes = require('./routes/message')
const likeRoutes = require('./routes/like')

const app = express()

//sécurité de l'app
app.use(helmet())										//Pour la sécurité: XSS filter, contentSecurityPolicy, frameguard, noSniff etc... (voir: https://helmetjs.github.io/)
app.use(function (req, res, next) {				//Pour éviter les attaque (D)DoS: block les requetes quand le server est trop occupé
	if (toobusy()) {
		res.status(503).send('Server Too Busy');
	} else {
		next();
	}
});

//CORS headers
app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');// http://127.0.0.1:4200 on autorise que les requetes localhosts, idealement https://nomDomaine.com
	res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
	next();
});


app.use(express.json())									   //On indique que les échanges se fonds en JSON
//app.use(express.urlencoded({ extended: false }))	//Pour accepter les POST/PUT au format formData

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/auth/', userRoutes)
app.use('/post/', postRoutes)
app.use('/message/', messageRoutes)
app.use('/like', likeRoutes)

module.exports = app