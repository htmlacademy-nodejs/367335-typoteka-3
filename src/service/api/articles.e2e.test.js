'use strict';

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);
const {StatusCodes} = require(`http-status-codes`);
const initDB = require(`../lib/init-db`);
const generateData = require(`../lib/generate-data`);
const articles = require(`./articles`);
const ArticlesService = require(`../data-services/articles`);
const CommentsService = require(`../data-services/comments`);

const mockPeoples = [`Андрей Рогов`, `Арсений Петухов`, `Виктор Золотов`, `Владимир Семенов`, `Иван Дурак`, `Михаил Юрьев`, `Петр Петров`, `Роман Доброхотов`, `Юрий Михайлов`];
const mockCategories = [`IT`, `Без рамки`, `Деньги`, `Деревья`, `Дети`, `Железо`, `За жизнь`, `Кино`, `Коты`, `Музыка`, `Отношения`, `Программирование`, `Разное`, `Россия`, `Соцсети`, `Фронтенд`];
const mockArticles = [
  {
    title: `Что такое золотое сечение`,
    announce: `Дуракам закон не писан. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравится только игры. Из под его пера вышло 8 платиновых альбомов. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать.`,
    fullText: `Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике.`,
    pubDate: `2020-09-26 15:59:06`,
    categories: [`Железо`, `Кино`],
    comments: []
  },
  {
    title: `Борьба с прокрастинацией`,
    announce: `Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравится только игры. Не сделано — и переделывать не придется. Программировать не настолько сложно, как об этом говорят. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать.`,
    fullText: `Из под его пера вышло 8 платиновых альбомов. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Кролики — это не только ценный мех, но и 3-4 кг диетического легкоусвояемого мяса. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Достичь успеха помогут ежедневные повторения. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Сижу за решеткой в темнице сырой. Вскормлённый в неволе орёл молодой... Дуракам закон не писан. Ёлки — это не просто красивое дерево. Это прочная древесина. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Смеркалось. Золотое сечение — соотношение двух величин, гармоническая пропорция. Простые ежедневные упражнения помогут достичь успеха. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Он написал больше 30 хитов. Это один из лучших рок-музыкантов. Ещё никогда Штирлиц не был так близок к провалу. Не было бы счастья, да несчастье помогло.`,
    pubDate: `2020-08-05 15:59:06`,
    categories: [`За жизнь`],
    comments: [
      {
        text: `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Плюсую, но слишком много буквы! Совсем немного... Планируете записать видосик на эту тему? Хочу такую же футболку :-) Мне кажется или я уже читал это где-то? Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.`
      }
    ]
  },
  {
    title: `Учим HTML и CSS`,
    announce: `Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Ёлки — это не просто красивое дерево. Это прочная древесина.`,
    fullText: `Вы можете достичь всего. Стоит только немного постараться и запастись книгами.\nСмеркалось.\nПростые ежедневные упражнения помогут достичь успеха.\nАльбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать.\nЁлки — это не просто красивое дерево. Это прочная древесина.\nСобрать камни бесконечности легко, если вы прирожденный герой.\nОн написал больше 30 хитов.\nЭто один из лучших рок-музыкантов.\nЗолотое сечение — соотношение двух величин, гармоническая пропорция.\nНе было бы счастья, да несчастье помогло.\nДостичь успеха помогут ежедневные повторения.\nПрограммировать не настолько сложно, как об этом говорят.\nИгры и программирование разные вещи. Не стоит идти в программисты, если вам нравится только игры.\nПомните, небольшое количество ежедневных упражнений лучше, чем один раз, но много.\nСижу за решеткой в темнице сырой. Вскормлённый в неволе орёл молодой...\nЕщё никогда Штирлиц не был так близок к провалу.\nПервая большая ёлка была установлена только в 1938 году.\nЭтот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете.\nНе сделано — и переделывать не придется.\nОсвоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике.\nИз под его пера вышло 8 платиновых альбомов.\nРок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле?\nКак начать действовать? Для начала просто соберитесь.`,
    pubDate: `2020-10-15 15:59:06`,
    categories: [`Фронтенд`, `Кино`, `Железо`, `Отношения`, `Дети`],
    comments: [
      {
        text: `Совсем немного... Плюсую, но слишком много буквы! Согласен с автором! Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Планируете записать видосик на эту тему? Это где ж такие красоты? Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.`
      },
      {
        text: `Это где ж такие красоты? Планируете записать видосик на эту тему? Согласен с автором! Совсем немного... Хочу такую же футболку :-) Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Мне кажется или я уже читал это где-то?`
      },
      {
        text: `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Это где ж такие красоты? Согласен с автором! Планируете записать видосик на эту тему? Плюсую, но слишком много буквы! Хочу такую же футболку :-) Совсем немного...`
      },
      {
        text: `Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Плюсую, но слишком много буквы! Хочу такую же футболку :-) Согласен с автором! Это где ж такие красоты? Совсем немного...`
      },
      {
        text: `Мне кажется или я уже читал это где-то? Это где ж такие красоты? Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Совсем немного... Хочу такую же футболку :-) Согласен с автором! Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.`
      },
      {
        text: `Согласен с автором! Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Мне кажется или я уже читал это где-то? Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Совсем немного... Хочу такую же футболку :-) Планируете записать видосик на эту тему?`
      },
      {
        text: `Плюсую, но слишком много буквы! Согласен с автором! Это где ж такие красоты? Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Совсем немного... Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Планируете записать видосик на эту тему?`
      }
    ]
  },
  {
    title: `Большие деньги в мире фронтенда`,
    announce: `Собрать камни бесконечности легко, если вы прирожденный герой. Не сделано — и переделывать не придется. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравится только игры. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать.`,
    fullText: `Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете.\nДостичь успеха помогут ежедневные повторения.\nРок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле?\nПрограммировать не настолько сложно, как об этом говорят.\nКролики — это не только ценный мех, но и 3-4 кг диетического легкоусвояемого мяса.\nАльбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать.\nЗолотое сечение — соотношение двух величин, гармоническая пропорция.`,
    pubDate: `2020-08-14 15:59:06`,
    categories: [`Деревья`, `IT`, `Кино`, `Разное`, `За жизнь`, `Музыка`, `Россия`],
    comments: [
      {
        text: `Это где ж такие красоты? Совсем немного... Плюсую, но слишком много буквы! Мне кажется или я уже читал это где-то? Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Согласен с автором!`
      },
      {
        text: `Планируете записать видосик на эту тему? Плюсую, но слишком много буквы! Это где ж такие красоты? Мне кажется или я уже читал это где-то? Совсем немного... Согласен с автором! Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.`
      },
      {
        text: `Хочу такую же футболку :-) Согласен с автором! Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Совсем немного... Плюсую, но слишком много буквы! Мне кажется или я уже читал это где-то?`
      },
      {
        text: `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Это где ж такие красоты? Мне кажется или я уже читал это где-то? Хочу такую же футболку :-) Совсем немного... Планируете записать видосик на эту тему? Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.`
      },
      {
        text: `Это где ж такие красоты? Мне кажется или я уже читал это где-то? Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Хочу такую же футболку :-) Плюсую, но слишком много буквы! Планируете записать видосик на эту тему? Согласен с автором!`
      },
      {
        text: `Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Планируете записать видосик на эту тему? Плюсую, но слишком много буквы! Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Хочу такую же футболку :-) Мне кажется или я уже читал это где-то? Согласен с автором!`
      },
      {
        text: `Совсем немного... Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Планируете записать видосик на эту тему? Плюсую, но слишком много буквы! Согласен с автором! Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Мне кажется или я уже читал это где-то?`
      },
      {
        text: `Планируете записать видосик на эту тему? Хочу такую же футболку :-) Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Плюсую, но слишком много буквы! Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Совсем немного... Согласен с автором!`
      }
    ]
  },
  {
    title: `Душим кошку за 5 минут`,
    announce: `Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравится только игры. Первая большая ёлка была установлена только в 1938 году. Как начать действовать? Для начала просто соберитесь. Не было бы счастья, да несчастье помогло.`,
    fullText: `Сижу за решеткой в темнице сырой. Вскормлённый в неволе орёл молодой...\nЕщё никогда Штирлиц не был так близок к провалу.\nЭто один из лучших рок-музыкантов.\nВы можете достичь всего. Стоит только немного постараться и запастись книгами.\nКролики — это не только ценный мех, но и 3-4 кг диетического легкоусвояемого мяса.\nИгры и программирование разные вещи. Не стоит идти в программисты, если вам нравится только игры.\nСмеркалось.\nДуракам закон не писан.`,
    pubDate: `2020-09-13 15:59:06`,
    categories: [`IT`, `Разное`, `За жизнь`],
    comments: [
      {
        text: `Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Мне кажется или я уже читал это где-то? Плюсую, но слишком много буквы! Хочу такую же футболку :-) Это где ж такие красоты? Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Планируете записать видосик на эту тему?`
      }
    ]
  }
];
const sampleArticle = {
  title: `Как начать программировать`,
  announce: `Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Как начать действовать? Для начала просто соберитесь. Это один из лучших рок-музыкантов. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать.`,
  fullText: `Ёлки — это не просто красивое дерево. Это прочная древесина. Достичь успеха помогут ежедневные повторения.`,
  pubDate: `2020-09-21 15:59:06`,
  categories: [1, 2],
  comments: []
};
const sampleKeys = Object.keys(sampleArticle);

const createAPI = async (logging = false) => {
  const mockDB = new Sequelize(`sqlite::memory:`, {logging});
  await initDB(mockDB, generateData({
    categories: mockCategories.slice(),
    articles: mockArticles.slice(),
    peoples: mockPeoples.slice()
  }));
  const app = express();
  app.use(express.json());
  articles(app, new ArticlesService(mockDB), new CommentsService(mockDB));
  return app;
};

describe(`API returns a list of all articles`, () => {
  let response;

  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app).get(`/articles`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(StatusCodes.OK));
  test(`Returns a list of 5 articles`, () => expect(response.body.length).toBe(5));
  test(`First article's id equals 1`, () => expect(response.body[0].id).toBe(1));
});

describe(`API returns an article with given id`, () => {
  const sampleTitle = `Что такое золотое сечение`;
  let response;

  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app).get(`/articles/1`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(StatusCodes.OK));
  test(`Article's 1 title is "${sampleTitle}"`, () => {
    expect(response.body.title).toBe(sampleTitle);
  });
});

describe(`API creates an article if data is valid`, () => {
  const newArticle = JSON.parse(JSON.stringify(sampleArticle));
  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app).post(`/articles`).send(newArticle);
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(StatusCodes.CREATED));
  test(`Articles count is changed`, () => request(app).get(`/articles`).expect((res) => {
    expect(res.body.length).toBe(6);
  }));
});

describe(`API refuses to create an article if data is invalid`, () => {
  const newArticle = JSON.parse(JSON.stringify(sampleArticle));

  test(`Without any required property response code is 400`, async () => {
    const app = await createAPI();
    const badArticle = {...newArticle};

    for (const key of sampleKeys) {
      delete badArticle[key];
    }
    await request(app).post(`/articles`).send(badArticle).expect(StatusCodes.BAD_REQUEST);
  });
});

describe(`API changes existent article`, () => {
  const newArticle = JSON.parse(JSON.stringify(sampleArticle));
  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app).put(`/articles/1`).send(newArticle);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(StatusCodes.OK));
  test(`Returns changed article`, () => expect(response.body).toEqual(true));
  test(`Article is really changed`, () => request(app).get(`/articles/1`).expect((res) => {
    expect(res.body.title).toBe(`Как начать программировать`);
  }));
});

test(`API returns status code 404 when trying to change non-existent article`, async () => {
  const validArticle = {
    title: `Это валидный`,
    announce: `объект`,
    fullText: `статьи`,
    pubDate: `2020-09-21 15:59:06`,
    categories: [1]
  };
  const app = await createAPI();

  return request(app).put(`/articles/99999`).send(validArticle).expect(StatusCodes.NOT_FOUND);
});

test(`API returns status code 400 when trying to change an article with invalid data`, async () => {
  const invalidArticle = {
    title: `Это невалидный`,
    announce: `объект`,
    fullText: `статьи`,
    categories: [1]
  };
  const app = await createAPI();

  return request(app).put(`/articles/1`).send(invalidArticle).expect(StatusCodes.BAD_REQUEST);
});

describe(`API correctly deletes an article`, () => {
  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app).delete(`/articles/4`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(StatusCodes.OK));
  test(`Articles count is 4 now`, () => request(app).get(`/articles`).expect((res) => {
    expect(res.body.length).toBe(4);
  }));
});

test(`API refuses to delete non-existent article`, async () => {
  const app = await createAPI();

  return request(app).delete(`/articles/99999`).expect(StatusCodes.NOT_FOUND);
});

describe(`API returns a list of comments to given article`, () => {
  const testComment = mockArticles[3].comments[0].text;
  let response;

  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app).get(`/articles/4/comments`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(StatusCodes.OK));
  test(`Returns list of 8 comments`, () => expect(response.body.length).toBe(8));
  test(`First comment's text is "${testComment}"`, () => expect(response.body[0].text).toBe(testComment));
});

describe(`API creates a comment if data is valid`, () => {
  const newComment = {
    text: `Валидному комментарию достаточно этого поля`
  };
  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app).post(`/articles/4/comments`).send(newComment);
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(StatusCodes.CREATED));
  test(`Returns comment created`, () => expect(response.body).toEqual(expect.objectContaining(newComment)));
  test(`Comments count is changed`, () => request(app).get(`/articles/4/comments`).expect((res) => {
    expect(res.body.length).toBe(9);
  }));
});

test(`API refuses to create a comment to non-existent article and returns status code 404`, async () => {
  const app = await createAPI();

  return request(app).post(`/articles/99999/comments`).send({
    text: `Неважно`
  }).expect(StatusCodes.NOT_FOUND);
});

test(`API refuses to create a comment when data is invalid, and returns status code 400`, async () => {
  const app = await createAPI();

  return request(app).post(`/articles/4/comments`).send({}).expect(StatusCodes.BAD_REQUEST);
});

describe(`API correctly deletes a comment`, () => {
  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app).delete(`/articles/3/comments/2`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(StatusCodes.OK));
  test(`Comments count is 6 now`, () => request(app).get(`/articles/3/comments`).expect((res) => {
    expect(res.body.length).toBe(6);
  }));
});

test(`API refuses to delete non-existent comment`, async () => {
  const app = await createAPI();

  return request(app).delete(`/articles/4/comments/999`).expect(StatusCodes.NOT_FOUND);
});

test(`API refuses to delete a comment to non-existent article`, async () => {
  const app = await createAPI();

  return request(app)
    .delete(`/articles/99999/comments/1`)
    .expect(StatusCodes.NOT_FOUND);
});
