--Получить список всех категорий (идентификатор, наименование категории):
SELECT "id", "title"
  FROM "Categories";

--Получить список категорий для которых создана минимум одна публикация (идентификатор, наименование категории):
SELECT "id", "title"
  FROM "Categories" c
  JOIN "ArticleCategories" ac ON c."id" = ac."CategoryId"
  GROUP BY "id";

--Получить список категорий с количеством публикаций (идентификатор, наименование категории, количество публикаций в категории):
SELECT "id", "title", COUNT(ac."ArticleId") AS "articlesCount"
  FROM "Categories" c
  FULL JOIN "ArticleCategories" ac ON c."id" = ac."CategoryId"
  GROUP BY "id";

--Получить список публикаций (идентификатор публикации, заголовок публикации, анонс публикации, дата публикации, имя и фамилия автора, контактный email, количество комментариев, наименование категорий). Сначала свежие публикации:
SELECT a."id", a."title", "announce", "pubDate", CONCAT("firstName", ' ', "lastName") AS "author", "email", COUNT(DISTINCT cm."id") AS "commentsCount", STRING_AGG(DISTINCT ct."title", ', ') as "categoriesList"
  FROM "Articles" a
  JOIN "People" p ON p."id" = a."PersonId"
  FULL JOIN "Comments" cm ON a."id" = cm."ArticleId"
  LEFT JOIN "ArticleCategories" ac ON ac."ArticleId" = a."id"
  LEFT JOIN "Categories" ct ON ac."CategoryId" = ct."id"
  GROUP BY a."id", p."id"
  ORDER BY "pubDate" DESC;

--Получить полную информацию определённой публикации (идентификатор публикации, заголовок публикации, анонс, полный текст публикации, дата публикации, путь к изображению, имя и фамилия автора, контактный email, количество комментариев, наименование категорий);
SELECT a."id", a."title", "announce", "pubDate", CONCAT("firstName", ' ', "lastName") AS "author", "email", COUNT(DISTINCT cm."id") AS "commentsCount", STRING_AGG(DISTINCT ct."title", ', ') as "categoriesList"
  FROM "Articles" a
  JOIN "People" p ON p.id = a."PersonId"
  FULL JOIN "Comments" cm ON a."id" = cm."ArticleId"
  LEFT JOIN "ArticleCategories" ac ON ac."ArticleId" = a."id"
  LEFT JOIN "Categories" ct ON ac."CategoryId" = ct."id"
  WHERE a."id" = 1
  GROUP BY a."id", p."id";

--Получить список из 5 свежих комментариев (идентификатор комментария, идентификатор публикации, имя и фамилия автора, текст комментария):
SELECT c."id", "ArticleId", CONCAT("firstName", ' ', "lastName") AS "author", "text"
  FROM "Comments" c
  JOIN "People" p ON p."id" = c."PersonId"
  ORDER BY c."id" DESC
  LIMIT 5;

--Получить список комментариев для определённой публикации (идентификатор комментария, идентификатор публикации, имя и фамилия автора, текст комментария). Сначала новые комментарии
SELECT c."id", "ArticleId", CONCAT("firstName", ' ', "lastName") AS "author", "text"
  FROM "Comments" c
  JOIN "People" p ON p."id" = c."PersonId"
  WHERE "ArticleId" = 1
  ORDER BY c."id" DESC;

--Обновить заголовок определённой публикации на «Как я встретил Новый год»:
UPDATE "Articles" SET "title" = 'Как я встретил Новый год'
  WHERE "id" = 1;
