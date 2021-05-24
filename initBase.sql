-- création de la base
CREATE DATABASE groupomania CHARACTER SET 'utf8';

-- création de l'utilisateur
CREATE USER 'groupomania'@'localhost'
IDENTIFIED BY 'password'
GRANT ALL PRIVILEGES
ON groupomania.*
TO 'groupomania'@'localhost';

-- Création des tables
CREATE TABLE users (
	id INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
	firstName varchar(30) NOT NULL,
	lastName varchar(30) NOT NULL,
	email varchar(50) NOT NULL UNIQUE,
	password TINYTEXT NOT NULL,				-- pas de VARCHAR car crypté avec bcrypt
	isAdmin TINYINT NOT NULL DEFAULT 0, 	-- 0 = User; 1 = Admin
	photo_URL varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE posts (
	id INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
	userId INT UNSIGNED NOT NULL,
	date DATETIME NOT NULL,
	url varchar(255) NOT NULL,
	title varchar(50) NOT NULL,
	description TEXT DEFAULT NULL,
	CONSTRAINT fk_posts_userId
		FOREIGN KEY (userId)
		REFERENCES users(id)
		ON DELETE CASCADE
)ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE comments (
	id INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
	content TEXT NOT NULL,
	userId INT UNSIGNED NOT NULL,
	postId INT UNSIGNED NOT NULL,
	CONSTRAINT fk_comments_userId
		FOREIGN KEY (userId)
		REFERENCES users(id)
		ON DELETE CASCADE,
	CONSTRAINT fk_comments_postId
		FOREIGN KEY (postId)
		REFERENCES posts(id)
		ON DELETE CASCADE
)ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE likes (
	id INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
	userId INT UNSIGNED NOT NULL,
	postId INT UNSIGNED NOT NULL,
	CONSTRAINT fk_likes_userId
		FOREIGN KEY (userId)
		REFERENCES users(id),
	CONSTRAINT fk_likes_postId
		FOREIGN KEY (postId)
		REFERENCES posts(id)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;