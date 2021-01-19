--Получить список всех категорий (идентификатор, наименование категории):
SELECT id, title
  FROM categories;

--Получить список категорий для которых создана минимум одна публикация (идентификатор, наименование категории):
SELECT id, title
  FROM categories c
  JOIN articles_categories ac ON c.id = ac.category_id
  GROUP BY id;

--Получить список категорий с количеством публикаций (идентификатор, наименование категории, количество публикаций в категории):
SELECT id, title, COUNT(ac.article_id) AS articles
  FROM categories c FULL
  JOIN articles_categories ac ON c.id = ac.category_id
  GROUP BY id;

--Получить список публикаций (идентификатор публикации, заголовок публикации, анонс публикации, дата публикации, имя и фамилия автора, контактный email, количество комментариев, наименование категорий). Сначала свежие публикации:
SELECT a.id, a.title, announce, pub_date, CONCAT(first_name, ' ', last_name) AS author, email, COUNT(DISTINCT cm.id) AS comments_count, STRING_AGG(DISTINCT ct.title, ', ') as categories_list
  FROM articles a
  JOIN peoples p ON p.id = a.people_id
  FULL JOIN comments cm ON a.id = cm.article_id
  LEFT JOIN articles_categories ac ON ac.article_id = a.id
  LEFT JOIN categories ct ON ac.category_id = ct.id
  GROUP BY a.id, p.id
  ORDER BY pub_date DESC;

--Получить полную информацию определённой публикации (идентификатор публикации, заголовок публикации, анонс, полный текст публикации, дата публикации, путь к изображению, имя и фамилия автора, контактный email, количество комментариев, наименование категорий);
SELECT a.id, a.title, announce, pub_date, CONCAT(first_name, ' ', last_name) AS author, email, COUNT(DISTINCT cm.id) AS comments_count, STRING_AGG(DISTINCT ct.title, ', ') as categories_list
  FROM articles a
  JOIN peoples p ON p.id = a.people_id
  FULL JOIN comments cm ON a.id = cm.article_id
  LEFT JOIN articles_categories ac ON ac.article_id = a.id
  LEFT JOIN categories ct ON ac.category_id = ct.id
  WHERE a.id = 1
  GROUP BY a.id, p.id;

--Получить список из 5 свежих комментариев (идентификатор комментария, идентификатор публикации, имя и фамилия автора, текст комментария):
SELECT c.id, article_id, CONCAT(first_name, ' ', last_name) AS author, text
  FROM comments c
  JOIN peoples p ON p.id = c.people_id
  ORDER BY c.id DESC
  LIMIT 5;

--Получить список комментариев для определённой публикации (идентификатор комментария, идентификатор публикации, имя и фамилия автора, текст комментария). Сначала новые комментарии
SELECT c.id, article_id, CONCAT(first_name, ' ', last_name) AS author, text
  FROM comments c
  JOIN peoples p ON p.id = c.people_id
  WHERE article_id = 1
  ORDER BY c.id DESC;

--Обновить заголовок определённой публикации на «Как я встретил Новый год»:
UPDATE articles SET title = 'Как я встретил Новый год'
  WHERE id = 1;
