# PertoldiAntoine_7_26042021
Debut du projet 7: le 26/04/2021
Il s'agit d'un projet de la plateforme OpenClassRooms dans le cadre de la formation developpeur web.
Ce projet ma permi de prendre en main le Framework frontEnd Angular et d'utiliser le SGBD MySQL.


# Lien vers repository:

https://github.com/Pertoldi/Pertoldi-PertoldiAntoine_7_26042021


# Architecture:

Le FrontEnd est faitvia le framework Angular, toutes les requetes utilise HttpClient et passent par les services, la librairie bootstrap est utilisée pour la mise en page des composants(boutons, forms).
Le BackEnd est une application express node.js.
La base de données utilisée est MySQL.


# Mise en place:

Mise en place de la base de données: 
	- Se connecter à MySQL avec root.
	- Lancer la commande `SOURCE initBase.sql` (Il faut lancer MySQL à la racine du projet ou écrire le chemin exact du fichier initBase.sql)
	- Cette commande créera la base groupomania, l'utilisateur local groupomania et les tables nécessaires à la base.

Mise en place du BackEnd:
	- Il faut se rendre dans le dossier backend.
	- Lancer la commande `npm install` pour installer toutes les dépendances du backend.
	- Ajouter le fichier .env à la racine du dossier backend.
	- Puis lancer la commande `node server.js` pour lancer le serveur.

Mise en place du FrontEnd:
	- Il faut se rendre dans le dossier frontend.
	- Lancer la commande `npm install` pour installer toutes les dépendances du frontend.
	- Lancer la commande `ng serve` pour lancer l'application frontend.


# Fonctionnalités:

	- systeme d'authentification + persistance de session
	- CRUD users
	- CRUD posts
	- CRUD comments
	- like des posts
	- droit Admin -> pour créer un compte admin, il faut changer la valeur de isAdmin dans la tables users de 0 à 1. Soit : `UPDATE users SET isAdmin = '1' WHERE id = LALIGNEVOULUE;`