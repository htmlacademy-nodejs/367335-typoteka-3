DROP DATABASE IF EXISTS typoteka;
CREATE DATABASE typoteka
  WITH
  OWNER = postgres
  ENCODING = 'UTF8'
  LC_COLLATE = 'C'
  LC_CTYPE = 'C'
  TABLESPACE = pg_default
  TEMPLATE template0
  CONNECTION LIMIT = -1;

DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS articles_categories;
DROP TABLE IF EXISTS articles;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS peoples;

CREATE TABLE peoples (
	id SERIAL PRIMARY KEY,
  first_name VARCHAR (100) NOT NULL,
  last_name VARCHAR (100) NOT NULL,
  email VARCHAR (100) NOT NULL UNIQUE,
  password_hash CHAR (128) NOT NULL,
  avatar VARCHAR (256) NOT NULL UNIQUE
);

CREATE TABLE categories (
	id SMALLSERIAL PRIMARY KEY,
  title VARCHAR (30) NOT NULL
);

CREATE TABLE articles (
	id SERIAL PRIMARY KEY,
  title VARCHAR (250) NOT NULL,
  announce VARCHAR (250) NOT NULL,
  full_text VARCHAR (1000),
  picture VARCHAR (256),
  pub_date date NOT NULL DEFAULT current_date,
  people_id INTEGER NOT NULL,
	FOREIGN KEY (people_id) REFERENCES peoples (id)
		ON DELETE CASCADE
		ON UPDATE CASCADE
);

CREATE TABLE articles_categories (
  article_id INTEGER NOT NULL,
  category_id SMALLINT NOT NULL,
	CONSTRAINT articles_categories_pk PRIMARY KEY (article_id, category_id),
	FOREIGN KEY (article_id) REFERENCES articles (id)
		ON DELETE CASCADE
		ON UPDATE CASCADE,
	FOREIGN KEY (category_id) REFERENCES categories (id)
		ON DELETE CASCADE
		ON UPDATE CASCADE
);

CREATE TABLE comments (
	id SERIAL PRIMARY KEY,
  text VARCHAR (250) NOT NULL,
  people_id INTEGER NOT NULL,
  article_id INTEGER NOT NULL,
	FOREIGN KEY (people_id) REFERENCES peoples (id)
		ON DELETE CASCADE
		ON UPDATE CASCADE,
	FOREIGN KEY (article_id) REFERENCES articles (id)
		ON DELETE CASCADE
		ON UPDATE CASCADE
);
