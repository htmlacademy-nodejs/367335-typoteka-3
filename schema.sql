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

DROP TABLE IF EXISTS "Comments";
DROP TABLE IF EXISTS "ArticleCategories";
DROP TABLE IF EXISTS "Articles";
DROP TABLE IF EXISTS "Categories";
DROP TABLE IF EXISTS "Users";

CREATE TABLE "Users" (
  "id" SERIAL PRIMARY KEY,
  "firstName" VARCHAR (100) NOT NULL,
  "lastName" VARCHAR (100) NOT NULL,
  "email" VARCHAR (100) NOT NULL UNIQUE,
  "passwordHash" CHAR (128) NOT NULL,
  "avatar" VARCHAR (250) NOT NULL UNIQUE,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE "Categories" (
  "id" SMALLSERIAL PRIMARY KEY,
  "title" VARCHAR (30) NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE "Articles" (
  "id" SERIAL PRIMARY KEY,
  "title" VARCHAR (250) NOT NULL,
  "announce" VARCHAR (250) NOT NULL,
  "fullText" VARCHAR (1000),
  "picture" VARCHAR (256),
  "pubDate" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "UserId" INTEGER NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  FOREIGN KEY ("UserId") REFERENCES "Users" ("id")
    ON DELETE CASCADE
);
CREATE INDEX ON "Articles"(title);

CREATE TABLE "ArticleCategories" (
  "ArticleId" INTEGER NOT NULL,
  "CategoryId" SMALLINT NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT "ArticleCategories_pkey" PRIMARY KEY ("ArticleId", "CategoryId"),
  FOREIGN KEY ("ArticleId") REFERENCES "Articles" ("id")
    ON DELETE CASCADE,
  FOREIGN KEY ("CategoryId") REFERENCES "Categories" ("id")
    ON DELETE CASCADE
);

CREATE TABLE "Comments" (
  "id" SERIAL PRIMARY KEY,
  "text" VARCHAR (250) NOT NULL,
  "UserId" INTEGER NOT NULL,
  "ArticleId" INTEGER NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  FOREIGN KEY ("UserId") REFERENCES "Users" ("id")
    ON DELETE CASCADE,
  FOREIGN KEY ("ArticleId") REFERENCES "Articles" ("id")
    ON DELETE CASCADE
);
