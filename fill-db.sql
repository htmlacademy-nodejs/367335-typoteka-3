-- Сгенерировано командой ./src/service/service.js "--fill" "3"

DO $$ BEGIN

-- Очистка БД
DELETE FROM public."People";
DELETE FROM public."Categories";
DELETE FROM public."Articles";
PERFORM setval('public."Articles_id_seq"'::regclass, 1, false);
PERFORM setval('public."People_id_seq"'::regclass, 1, false);
PERFORM setval('public."Categories_id_seq"'::regclass, 1, false);
PERFORM setval('public."Comments_id_seq"'::regclass, 1, false);

-- Добавление пользователей
INSERT INTO public."People" ("firstName", "lastName", "email", "passwordHash", "avatar", "createdAt", "updatedAt") VALUES
('Андрей', 'Рогов', 'w4IBOFsdwY@4mXWimfYP.net', '$2b$10$WAn7edXDH9gnkWeCrqOFqeoZx6KmXDr4KApMUBw1rX7R6Z.oNh4f6', '9kb0ry0hvigt.png', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Арсений', 'Петухов', 'idWAFw6vuT@ucksQL446.com', '$2b$10$dEIV0O3diFm0Fv5UmjnBueRulcAUAY7xXkU/f1Bxl5XDCjGMlVnGi', 'oewfqla.png', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Виктор', 'Золотов', 'WVGnj8@blyWx.net', '$2b$10$jg1yPav19UXp69TW2M51EeZZCffDgLtniA57Y5nFMoNjkcB7OpvEG', 'oiye.png', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Владимир', 'Семенов', 'AnKZdQV7NA@MCV2YYP9Hjgm.com', '$2b$10$k6jRw1nNDdCkeMdoH42UKOCMQVW1sZuKDp5mc1gY005rjqv5puZ2G', '6xxlps7nxgdrjnn.jpg', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Иван', 'Дурак', 't9ikjoxozaV@9_Vb.com', '$2b$10$GxVPXD.3avtuDgP4JebG7.BOUtkBT4ueRfldhgzX4.zaInPHK5/vq', 'w8da.png', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Михаил', 'Юрьев', 'MBIKAV6F@Sjzcv8Seu.ru', '$2b$10$bQP5xyqXQO9p8yaC50cN2uD9RSxldYMmjRVyQRi28Y2FJedao5tj6', 'hgyo0qr8k.png', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Петр', 'Петров', 'OOgU@qvDe.academy', '$2b$10$EtWPs.TR.dxqukzvJCb0te5o77OSxonFWMYUqJnOVgpN2KVcMnoHG', 'qivewybrbc.png', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Роман', 'Доброхотов', 'OqvUir@79Z0UA5P.ru', '$2b$10$itTcIA9xNT74ntQSkzaZm.NQsMjJi51J4hE6Ab32COIcX5AjV3Fw2', 'bajklukulczlpb-v.jpg', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Юрий', 'Михайлов', 'a56MDY@De8qQOS.academy', '$2b$10$5G5.GPbnZsL9cmIrF37Hp.vct2YsDkNSAapUyDDZdIhJiS3L.xcXq', 'y7rgzqrxz3o.png', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Добавление категорий
INSERT INTO public."Categories" ("title", "createdAt", "updatedAt") VALUES
('Деревья', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('За жизнь', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Без рамки', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Разное', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('IT', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Музыка', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Кино', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Программирование', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Железо', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Россия', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Фронтенд', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Деньги', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Отношения', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Коты', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Соцсети', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Дети', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Добавление публикаций
INSERT INTO public."Articles" ("title", "announce", "fullText", "picture", "pubDate", "createdAt", "updatedAt", "PersonId") VALUES
('Большие деньги в мире фронтенда', 'Не было бы счастья, да несчастье помогло. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Он написал больше 30 хитов. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравится только игры.', 'Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Программировать не настолько сложно, как об этом говорят. Золотое сечение — соотношение двух величин, гармоническая пропорция. Собрать камни бесконечности легко, если вы прирожденный герой. Простые ежедневные упражнения помогут достичь успеха.', 'h0ls5tqmp862.png', '2021-03-25 14:29:15', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2),
('Жизнь и обманы Альбуса Дамблдора', 'Собрать камни бесконечности легко, если вы прирожденный герой. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со ', 'Ещё никогда Штирлиц не был так близок к провалу.
Кролики — это не только ценный мех, но и 3-4 кг диетического легкоусвояемого мяса.
Из под его пера вышло 8 платиновых альбомов.
Это один из лучших рок-музыкантов.
Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете.
Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать.
Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравится только игры.
Он написал больше 30 хитов.
Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем.
Не сделано — и переделывать не придется.
Вы можете достичь всего. Стоит только немного постараться и запастись книгами.
Смеркалось.
Сижу за решеткой в темнице сырой. Вскормлённый в неволе орёл молодой...
Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много.', 'm4vhpdz7lsdq2o.jpg', '2021-03-24 14:29:15', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 8),
('Новые услуги мобильных операторов', 'Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Сижу за решеткой в темнице сырой. Вскормлённый в неволе орёл молодой... Это один из лучших рок-музыкантов. Ёлки — это не просто красивое дерево. Это прочная древесина.', 'Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.', 'txo9kwgg_awwe9.jpg', '2021-06-01 14:29:15', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3);

-- Добавление комментариев
INSERT INTO public."Comments" ("text", "createdAt", "updatedAt", "PersonId", "ArticleId") VALUES
('Плюсую, но слишком много буквы! Согласен с автором! Мне кажется или я уже читал это где-то? Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Совсем немного...', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 6, 1),
('Плюсую, но слишком много буквы! Совсем немного... Планируете записать видосик на эту тему? Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Это где ж такие красоты? Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2, 1),
('Мне кажется или я уже читал это где-то? Хочу такую же футболку :-) Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Планируете записать видосик на эту тему? Согласен с автором! Это где ж такие красоты?', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 6, 1),
('Это где ж такие красоты? Мне кажется или я уже читал это где-то? Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Плюсую, но слишком много буквы! Планируете записать видосик на эту тему? Совсем немного...', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 8, 1),
('Совсем немного... Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Плюсую, но слишком много буквы! Планируете записать видосик на эту тему? Это где ж такие красоты? Согласен с автором!', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2, 1),
('Хочу такую же футболку :-) Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Плюсую, но слишком много буквы! Мне кажется или я уже читал это где-то? Совсем немного... Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 9, 1),
('Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Плюсую, но слишком много буквы! Хочу такую же футболку :-) Мне кажется или я уже читал это где-то? Совсем немного... Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1, 2),
('Планируете записать видосик на эту тему? Мне кажется или я уже читал это где-то? Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Совсем немного... Хочу такую же футболку :-) Это где ж такие красоты?', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2, 2),
('Планируете записать видосик на эту тему? Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Плюсую, но слишком много буквы! Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Хочу такую же футболку :-) Мне кажется или я уже чит', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2, 2),
('Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Мне кажется или я уже читал это где-то? Планируете записать видосик на эту тему? Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Это где ж такие красоты? Плюсую, но слишком ', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1, 3),
('Хочу такую же футболку :-) Планируете записать видосик на эту тему? Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Совсем немного... Мне кажется или я уже читал это где-то? Это где ж такие красоты?', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 9, 3),
('Согласен с автором! Совсем немного... Планируете записать видосик на эту тему? Мне кажется или я уже читал это где-то? Это где ж такие красоты? Плюсую, но слишком много буквы!', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 9, 3);

-- Связь публикаций с категориями
INSERT INTO public."ArticleCategories" ("createdAt", "updatedAt", "ArticleId", "CategoryId") VALUES
(CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1, 9),
(CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1, 8),
(CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1, 13),
(CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1, 10),
(CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1, 3),
(CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1, 11),
(CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2, 9),
(CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2, 13),
(CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2, 10),
(CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2, 4),
(CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2, 8),
(CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2, 6),
(CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2, 1),
(CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2, 2),
(CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2, 16),
(CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2, 12),
(CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3, 8),
(CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3, 3),
(CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3, 13),
(CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3, 16),
(CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3, 2),
(CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3, 5),
(CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3, 7),
(CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3, 12),
(CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3, 4);

END $$;