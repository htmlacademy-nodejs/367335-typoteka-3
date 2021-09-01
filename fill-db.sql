-- Сгенерировано командой ./src/service/service.js "--fill" "3"

DO $$ BEGIN

-- Очистка БД
DELETE FROM public."Users";
DELETE FROM public."Categories";
DELETE FROM public."Articles";
PERFORM setval('public."Articles_id_seq"'::regclass, 1, false);
PERFORM setval('public."Users_id_seq"'::regclass, 1, false);
PERFORM setval('public."Categories_id_seq"'::regclass, 1, false);
PERFORM setval('public."Comments_id_seq"'::regclass, 1, false);

-- Добавление пользователей
INSERT INTO public."Users" ("firstName", "lastName", "email", "passwordHash", "avatar", "createdAt", "updatedAt") VALUES
('Андрей', 'Рогов', 'jGboNV@NhUpobhSOEi.ru', '$2b$10$CBTSpOhGUmKqVGe0w6IykOffYWVy17Ua24f5NRg/C0/m9oDwJ9Ck.', 'i7-hp_.jpg', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Арсений', 'Петухов', 'hFyyw9D0Qs5@3pT3.ru', '$2b$10$hwwwsEsHC3trznnLhsBnde9dOcE9WqCRDrarVk.fXZs/L4wF9iJk6', 'z88cyckelqw6d44e.jpg', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Виктор', 'Золотов', '9maY2lZ5RPuj@74igtO.ru', '$2b$10$hXf9kegiyql24C/Hdqa5weWhHSeJqXCbzFUJ0wnX6o7N9AA6p47FC', 'nfnsh28x.jpg', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Владимир', 'Семенов', '7WqpTCZf@WS-WmcxzO.academy', '$2b$10$1QLL4a2OfzGCCVEt/OjjlOmHIId8cQSWwiwnpz8SLq.UI0vi9tVse', 'dg5isbfzvb.png', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Иван', 'Дурак', 'YbDYU3pgECJ@32SoCRfMmc.com', '$2b$10$ZjCmA6ReQNZogy1thf10rueGYaI4Kl3259d3sexUqr5r3D/YY86Cy', 'arzx3_dc.jpg', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Михаил', 'Юрьев', '03-OD@tiEMW.ru', '$2b$10$SoNPYzl9xYwYumEmt7Qyme/O3XLE4a4GzAeWk8Qn8MgJW9GxHng3C', 'omn9.png', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Петр', 'Петров', 'ZeUdw@iZyf.net', '$2b$10$OHdstFvCOnhKCTE.qXfHbuXieFL5cUrE/0545CApbre90u.cR6pJa', 'p-g.jpg', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Роман', 'Доброхотов', 'KOWhXIcAy@F9zu7.ru', '$2b$10$7FvJNZ.SK.ojMZw.MtSR5OylEr1SZ6OeuwnltLFAFnzm//P.D.aLW', 'jupty3wi.png', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Юрий', 'Михайлов', '3JfN@SwDNE.academy', '$2b$10$MDVqTUsm/qSEaV5rthWvgup.3TwHY8vmUzIzFYS3yljpjpFDUWfUK', 'h6dhd.jpg', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

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
INSERT INTO public."Articles" ("title", "announce", "fullText", "picture", "pubDate", "createdAt", "updatedAt", "UserId") VALUES
('Жизнь и обманы Альбуса Дамблдора', 'Не было бы счастья, да несчастье помогло. Из под его пера вышло 8 платиновых альбомов. Как начать действовать? Для начала просто соберитесь. Не сделано — и переделывать не придется.', 'Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике.
Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете.
Первая большая ёлка была установлена только в 1938 году.
Золотое сечение — соотношение двух величин, гармоническая пропорция.
Из под его пера вышло 8 платиновых альбомов.
Не было бы счастья, да несчастье помогло.
Простые ежедневные упражнения помогут достичь успеха.
Ёлки — это не просто красивое дерево. Это прочная древесина.
Дуракам закон не писан.', '_9ahyfcrth.png', '2021-08-10 18:32:17', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3),
('Как достигнуть успеха не вставая с кресла', 'Он написал больше 30 хитов. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Достичь успеха помогут ежедневные повторения. Программировать не настолько сложно, как об этом говорят.', 'Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем.
Ёлки — это не просто красивое дерево. Это прочная древесина.
Кролики — это не только ценный мех, но и 3-4 кг диетического легкоусвояемого мяса.
Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле?
Он написал больше 30 хитов.
Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике.
Из под его пера вышло 8 платиновых альбомов.
Как начать действовать? Для начала просто соберитесь.
Программировать не настолько сложно, как об этом говорят.
Не было бы счастья, да несчастье помогло.
Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.
Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете.
Золотое сечение — соотношение двух величин, гармоническая пропорция.
Дуракам закон не писан.
Это один из лучших рок-музыкантов.
Игры и программирование разные вещи. Не стоит идти в программист', 'oh1.jpg', '2021-08-17 18:32:17', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1),
('Что такое золотое сечение', 'Смеркалось. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Программировать не настолько сложно, как об этом говорят. Сижу за решеткой в темнице сырой. Вскормлённый в неволе орёл молодой...', 'Это один из лучших рок-музыкантов.
Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике.', 'hbz8gxq.png', '2021-07-05 18:32:17', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 5);

-- Добавление комментариев
INSERT INTO public."Comments" ("text", "createdAt", "updatedAt", "UserId", "ArticleId") VALUES
('Согласен с автором! Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Плюсую, но слишком много буквы! Мне кажется или я уже читал это где-то? Совсем немного... Это где ж такие красоты?', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 4, 1),
('Мне кажется или я уже читал это где-то? Это где ж такие красоты? Согласен с автором! Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Плюсую, но слишком много буквы! Хочу такую же футболку :-)', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 4, 1),
('Это где ж такие красоты? Планируете записать видосик на эту тему? Плюсую, но слишком много буквы! Согласен с автором! Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Совсем немного...', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2, 1),
('Планируете записать видосик на эту тему? Согласен с автором! Совсем немного... Плюсую, но слишком много буквы! Это где ж такие красоты? Хочу такую же футболку :-)', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 4, 2),
('Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Это где ж такие красоты? Совсем немного... Плюсую, но слишком много буквы! Хочу такую же футболку :-)', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3, 2),
('Хочу такую же футболку :-) Это где ж такие красоты? Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Плюсую, но слишком много буквы! Согласен с автором!', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 4, 2),
('Согласен с автором! Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Хочу такую же футболку :-) Мне кажется или я уже читал это где-то? Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Плюсую, но слишком много буквы!', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2, 3),
('Совсем немного... Плюсую, но слишком много буквы! Это где ж такие красоты? Согласен с автором! Планируете записать видосик на эту тему? Хочу такую же футболку :-)', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 5, 3),
('Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Плюсую, но слишком много буквы! Это где ж такие красоты? Планируете записать видосик на эту тему? Согласен с автором!', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 4, 3),
('Хочу такую же футболку :-) Совсем немного... Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Согласен с автором! Плюсую, но слишком много буквы! Мне кажется или я уже читал это где-то?', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 9, 3),
('Мне кажется или я уже читал это где-то? Планируете записать видосик на эту тему? Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Согласен с автором! Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Хочу такую же футболку :', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 5, 3),
('Это где ж такие красоты? Плюсую, но слишком много буквы! Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Согласен с автором! Хочу такую же футболку :-) Совсем немного...', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 7, 3),
('Совсем немного... Это где ж такие красоты? Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Согласен с автором! Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Планируете записать видосик на эту тему?', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 4, 3),
('Плюсую, но слишком много буквы! Согласен с автором! Планируете записать видосик на эту тему? Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Мне кажется или я уже читал это где-то? Совсем немного...', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3, 3);

-- Связь публикаций с категориями
INSERT INTO public."ArticleCategories" ("createdAt", "updatedAt", "ArticleId", "CategoryId") VALUES
(CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1, 1),
(CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1, 16),
(CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1, 2),
(CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1, 15),
(CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2, 9),
(CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2, 14),
(CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2, 12),
(CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2, 15),
(CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3, 3),
(CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3, 11);

END $$;