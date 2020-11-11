'use strict';

const express = require(`express`);
const request = require(`supertest`);
const {StatusCodes} = require(`http-status-codes`);

const articles = require(`./articles`);
const ArticlesService = require(`../data-services/articles`);
const CommentsService = require(`../data-services/comments`);
const mockData = [
  {
    id: `Np4_Wq`,
    title: `Что такое золотое сечение`,
    announce: `Дуракам закон не писан. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравится только игры. Из под его пера вышло 8 платиновых альбомов. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать.`,
    fullText: `Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике.`,
    createdDate: `2020-09-26 15:59:06`,
    category: `Железо\nКино`,
    comments: []
  },
  {
    id: `ASUjSt`,
    title: `Борьба с прокрастинацией`,
    announce: `Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравится только игры. Не сделано — и переделывать не придется. Программировать не настолько сложно, как об этом говорят. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать.`,
    fullText: `Из под его пера вышло 8 платиновых альбомов. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Кролики — это не только ценный мех, но и 3-4 кг диетического легкоусвояемого мяса. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Достичь успеха помогут ежедневные повторения. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Сижу за решеткой в темнице сырой. Вскормлённый в неволе орёл молодой... Дуракам закон не писан. Ёлки — это не просто красивое дерево. Это прочная древесина. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Смеркалось. Золотое сечение — соотношение двух величин, гармоническая пропорция. Простые ежедневные упражнения помогут достичь успеха. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Он написал больше 30 хитов. Это один из лучших рок-музыкантов. Ещё никогда Штирлиц не был так близок к провалу. Не было бы счастья, да несчастье помогло.`,
    createdDate: `2020-08-05 15:59:06`,
    category: `За жизнь`,
    comments: [
      {
        id: `i29AMK`,
        text: `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Плюсую, но слишком много буквы! Совсем немного... Планируете записать видосик на эту тему? Хочу такую же футболку :-) Мне кажется или я уже читал это где-то? Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.`
      }
    ]
  },
  {
    id: `sHsoKh`,
    title: `Учим HTML и CSS`,
    announce: `Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Ёлки — это не просто красивое дерево. Это прочная древесина.`,
    fullText: `Вы можете достичь всего. Стоит только немного постараться и запастись книгами.\nСмеркалось.\nПростые ежедневные упражнения помогут достичь успеха.\nАльбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать.\nЁлки — это не просто красивое дерево. Это прочная древесина.\nСобрать камни бесконечности легко, если вы прирожденный герой.\nОн написал больше 30 хитов.\nЭто один из лучших рок-музыкантов.\nЗолотое сечение — соотношение двух величин, гармоническая пропорция.\nНе было бы счастья, да несчастье помогло.\nДостичь успеха помогут ежедневные повторения.\nПрограммировать не настолько сложно, как об этом говорят.\nИгры и программирование разные вещи. Не стоит идти в программисты, если вам нравится только игры.\nПомните, небольшое количество ежедневных упражнений лучше, чем один раз, но много.\nСижу за решеткой в темнице сырой. Вскормлённый в неволе орёл молодой...\nЕщё никогда Штирлиц не был так близок к провалу.\nПервая большая ёлка была установлена только в 1938 году.\nЭтот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете.\nНе сделано — и переделывать не придется.\nОсвоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике.\nИз под его пера вышло 8 платиновых альбомов.\nРок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле?\nКак начать действовать? Для начала просто соберитесь.`,
    createdDate: `2020-10-15 15:59:06`,
    category: `Фронтенд\nКино\nЖелезо\nОтношения\nДети`,
    comments: [
      {
        id: `EqKtHg`,
        text: `Совсем немного... Плюсую, но слишком много буквы! Согласен с автором! Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Планируете записать видосик на эту тему? Это где ж такие красоты? Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.`
      },
      {
        id: `RrVszI`,
        text: `Это где ж такие красоты? Планируете записать видосик на эту тему? Согласен с автором! Совсем немного... Хочу такую же футболку :-) Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Мне кажется или я уже читал это где-то?`
      },
      {
        id: `apPvw7`,
        text: `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Это где ж такие красоты? Согласен с автором! Планируете записать видосик на эту тему? Плюсую, но слишком много буквы! Хочу такую же футболку :-) Совсем немного...`
      },
      {
        id: `7hQSF6`,
        text: `Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Плюсую, но слишком много буквы! Хочу такую же футболку :-) Согласен с автором! Это где ж такие красоты? Совсем немного...`
      },
      {
        id: `b7iuVl`,
        text: `Мне кажется или я уже читал это где-то? Это где ж такие красоты? Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Совсем немного... Хочу такую же футболку :-) Согласен с автором! Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.`
      },
      {
        id: `7VNPSV`,
        text: `Согласен с автором! Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Мне кажется или я уже читал это где-то? Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Совсем немного... Хочу такую же футболку :-) Планируете записать видосик на эту тему?`
      },
      {
        id: `UYEVoG`,
        text: `Плюсую, но слишком много буквы! Согласен с автором! Это где ж такие красоты? Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Совсем немного... Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Планируете записать видосик на эту тему?`
      }
    ]
  },
  {
    id: `zE8SF6`,
    title: `Большие деньги в мире фронтенда`,
    announce: `Собрать камни бесконечности легко, если вы прирожденный герой. Не сделано — и переделывать не придется. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравится только игры. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать.`,
    fullText: `Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете.\nДостичь успеха помогут ежедневные повторения.\nРок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле?\nПрограммировать не настолько сложно, как об этом говорят.\nКролики — это не только ценный мех, но и 3-4 кг диетического легкоусвояемого мяса.\nАльбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать.\nЗолотое сечение — соотношение двух величин, гармоническая пропорция.`,
    createdDate: `2020-08-14 15:59:06`,
    category: `Деревья\nIT\nКино\nРазное\nЗа жизнь\nМузыка\nРоссия`,
    comments: [
      {
        id: `uaZMaj`,
        text: `Это где ж такие красоты? Совсем немного... Плюсую, но слишком много буквы! Мне кажется или я уже читал это где-то? Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Согласен с автором!`
      },
      {
        id: `KVceF4`,
        text: `Планируете записать видосик на эту тему? Плюсую, но слишком много буквы! Это где ж такие красоты? Мне кажется или я уже читал это где-то? Совсем немного... Согласен с автором! Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.`
      },
      {
        id: `312Y0n`,
        text: `Хочу такую же футболку :-) Согласен с автором! Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Совсем немного... Плюсую, но слишком много буквы! Мне кажется или я уже читал это где-то?`
      },
      {
        id: `aiUW2_`,
        text: `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Это где ж такие красоты? Мне кажется или я уже читал это где-то? Хочу такую же футболку :-) Совсем немного... Планируете записать видосик на эту тему? Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.`
      },
      {
        id: `Ked9-u`,
        text: `Это где ж такие красоты? Мне кажется или я уже читал это где-то? Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Хочу такую же футболку :-) Плюсую, но слишком много буквы! Планируете записать видосик на эту тему? Согласен с автором!`
      },
      {
        id: `r-MsxR`,
        text: `Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Планируете записать видосик на эту тему? Плюсую, но слишком много буквы! Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Хочу такую же футболку :-) Мне кажется или я уже читал это где-то? Согласен с автором!`
      },
      {
        id: `knveEP`,
        text: `Совсем немного... Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Планируете записать видосик на эту тему? Плюсую, но слишком много буквы! Согласен с автором! Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Мне кажется или я уже читал это где-то?`
      },
      {
        id: `PeCZOB`,
        text: `Планируете записать видосик на эту тему? Хочу такую же футболку :-) Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Плюсую, но слишком много буквы! Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Совсем немного... Согласен с автором!`
      }
    ]
  },
  {
    id: `D3LX4j`,
    title: `Душим кошку за 5 минут`,
    announce: `Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравится только игры. Первая большая ёлка была установлена только в 1938 году. Как начать действовать? Для начала просто соберитесь. Не было бы счастья, да несчастье помогло.`,
    fullText: `Сижу за решеткой в темнице сырой. Вскормлённый в неволе орёл молодой...\nЕщё никогда Штирлиц не был так близок к провалу.\nЭто один из лучших рок-музыкантов.\nВы можете достичь всего. Стоит только немного постараться и запастись книгами.\nКролики — это не только ценный мех, но и 3-4 кг диетического легкоусвояемого мяса.\nИгры и программирование разные вещи. Не стоит идти в программисты, если вам нравится только игры.\nСмеркалось.\nДуракам закон не писан.`,
    createdDate: `2020-09-13 15:59:06`,
    category: `IT\nРазное\nЗа жизнь`,
    comments: [
      {
        id: `Q_0yv6`,
        text: `Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Мне кажется или я уже читал это где-то? Плюсую, но слишком много буквы! Хочу такую же футболку :-) Это где ж такие красоты? Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Планируете записать видосик на эту тему?`
      }
    ]
  }
];
const sampleArticle = {
  title: `Как начать программировать`,
  announce: `Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Как начать действовать? Для начала просто соберитесь. Это один из лучших рок-музыкантов. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать.`,
  fullText: `Ёлки — это не просто красивое дерево. Это прочная древесина. Достичь успеха помогут ежедневные повторения.`,
  createdDate: `2020-09-21 15:59:06`,
  category: `Фронтенд\nIT`
};
const sampleKeys = Object.keys(sampleArticle);

const createAPI = () => {
  const app = express();
  const cloneData = JSON.parse(JSON.stringify(mockData));
  app.use(express.json());
  articles(app, new ArticlesService(cloneData), new CommentsService());
  return app;
};

describe(`API returns a list of all articles`, () => {
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app).get(`/articles`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(StatusCodes.OK));
  test(`Returns a list of 5 articles`, () => expect(response.body.length).toBe(5));
  test(`First article's id equals "Np4_Wq"`, () => expect(response.body[0].id).toBe(`Np4_Wq`));
});

describe(`API returns an article with given id`, () => {
  const app = createAPI();
  const sampleTitle = `Что такое золотое сечение`;
  let response;

  beforeAll(async () => {
    response = await request(app).get(`/articles/Np4_Wq`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(StatusCodes.OK));
  test(`Article's title is "${sampleTitle}"`, () => {
    expect(response.body.title).toBe(sampleTitle);
  });
});

describe(`API creates an article if data is valid`, () => {
  const newArticle = JSON.parse(JSON.stringify(sampleArticle));
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app).post(`/articles`).send(newArticle);
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(StatusCodes.CREATED));
  test(`Returns article created`, () => expect(response.body).toEqual(expect.objectContaining(newArticle)));
  test(`Articles count is changed`, () => request(app).get(`/articles`).expect((res) => {
    expect(res.body.length).toBe(6);
  }));
});

describe(`API refuses to create an article if data is invalid`, () => {
  const newArticle = JSON.parse(JSON.stringify(sampleArticle));
  const app = createAPI();

  test(`Without any required property response code is 400`, async () => {
    for (const key of sampleKeys) {
      const badArticle = {...newArticle};
      delete badArticle[key];
      await request(app).post(`/articles`).send(badArticle).expect(StatusCodes.BAD_REQUEST);
    }
  });
});

describe(`API changes existent article`, () => {
  const newArticle = JSON.parse(JSON.stringify(sampleArticle));
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app).put(`/articles/Np4_Wq`).send(newArticle);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(StatusCodes.OK));
  test(`Returns changed article`, () => expect(response.body).toEqual(expect.objectContaining(newArticle)));
  test(`Article is really changed`, () => request(app).get(`/articles/Np4_Wq`).expect((res) => {
    expect(res.body.title).toBe(`Как начать программировать`);
  }));
});

test(`API returns status code 404 when trying to change non-existent article`, () => {
  const validArticle = {
    title: `Это валидный`,
    announce: `объект`,
    fullText: `статьи`,
    createdDate: `2020-09-21 15:59:06`,
    category: `однако\n404`
  };
  const app = createAPI();

  return request(app).put(`/articles/NOEXST`).send(validArticle).expect(StatusCodes.NOT_FOUND);
});

test(`API returns status code 400 when trying to change an article with invalid data`, () => {
  const invalidArticle = {
    title: `Это невалидный`,
    announce: `объект`,
    fullText: `статьи`,
    category: `нет\nполя\ndate`
  };
  const app = createAPI();

  return request(app).put(`/articles/Np4_Wq`).send(invalidArticle).expect(StatusCodes.BAD_REQUEST);
});

describe(`API correctly deletes an article`, () => {
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app).delete(`/articles/zE8SF6`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(StatusCodes.OK));
  test(`Returns deleted article`, () => expect(response.body.id).toBe(`zE8SF6`));
  test(`Articles count is 4 now`, () => request(app).get(`/articles`).expect((res) => {
    expect(res.body.length).toBe(4);
  }));
});

test(`API refuses to delete non-existent article`, () => {
  const app = createAPI();

  return request(app).delete(`/articles/NOEXST`).expect(StatusCodes.NOT_FOUND);
});

describe(`API returns a list of comments to given article`, () => {
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app).get(`/articles/zE8SF6/comments`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(StatusCodes.OK));
  test(`Returns list of 8 comments`, () => expect(response.body.length).toBe(8));
  test(`First comment's id is "uaZMaj"`, () => expect(response.body[0].id).toBe(`uaZMaj`));
});

describe(`API creates a comment if data is valid`, () => {
  const newComment = {
    text: `Валидному комментарию достаточно этого поля`
  };
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app).post(`/articles/zE8SF6/comments`).send(newComment);
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(StatusCodes.CREATED));
  test(`Returns comment created`, () => expect(response.body).toEqual(expect.objectContaining(newComment)));
  test(`Comments count is changed`, () => request(app).get(`/articles/zE8SF6/comments`).expect((res) => {
    expect(res.body.length).toBe(9);
  }));
});

test(`API refuses to create a comment to non-existent article and returns status code 404`, () => {
  const app = createAPI();

  return request(app).post(`/articles/NOEXST/comments`).send({
    text: `Неважно`
  }).expect(StatusCodes.NOT_FOUND);
});

test(`API refuses to create a comment when data is invalid, and returns status code 400`, () => {
  const app = createAPI();

  return request(app).post(`/articles/zE8SF6/comments`).send({}).expect(StatusCodes.BAD_REQUEST);
});

describe(`API correctly deletes a comment`, () => {
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app).delete(`/articles/zE8SF6/comments/KVceF4`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(StatusCodes.OK));
  test(`Returns comment deleted`, () => expect(response.body.id).toBe(`KVceF4`));
  test(`Comments count is 7 now`, () => request(app).get(`/articles/zE8SF6/comments`).expect((res) => {
    expect(res.body.length).toBe(7);
  }));
});

test(`API refuses to delete non-existent comment`, () => {
  const app = createAPI();

  return request(app).delete(`/articles/zE8SF6/comments/NOEXST`).expect(StatusCodes.NOT_FOUND);
});

test(`API refuses to delete a comment to non-existent article`, () => {
  const app = createAPI();

  return request(app)
    .delete(`/articles/NOEXST/comments/KVceF4`)
    .expect(StatusCodes.NOT_FOUND);
});
