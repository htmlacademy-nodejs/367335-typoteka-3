'use strict';

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);
const {StatusCodes} = require(`http-status-codes`);

const initDB = require(`../lib/init-db`);
const {generateData} = require(`../lib/mock-utils`);
const categories = require(`./categories`);
const CategoriesService = require(`../data-services/categories`);

const mockUsers = [`Андрей Рогов`, `Арсений Петухов`, `Виктор Золотов`, `Владимир Семенов`, `Иван Дурак`, `Михаил Юрьев`, `Петр Петров`, `Роман Доброхотов`, `Юрий Михайлов`];
const mockCategories = [`IT`, `Без рамки`, `Деньги`, `Деревья`, `Дети`, `Железо`, `За жизнь`, `Кино`, `Коты`, `Музыка`, `Отношения`, `Программирование`, `Разное`, `Россия`, `Соцсети`, `Фронтенд`];

const mockArticles = [
  {
    title: `Лучше рок-музыканты 20-века`,
    announce: `Смеркалось. Дуракам закон не писан. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Первая большая ёлка была установлена только в 1938 году.`,
    fullText: `Смеркалось.`,
    pubDate: `2020-09-10 12:17:31`,
    categories: [`Железо`, `Дети`, `За жизнь`, `Деньги`, `Россия`, `Фронтенд`, `Коты`, `Отношения`, `Музыка`],
    Comments: [
      {
        text: `Хочу такую же футболку :-) Мне кажется или я уже читал это где-то? Совсем немного... Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Плюсую, но слишком много буквы! Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Согласен с автором!"`,
        UserId: 1
      },
      {
        text: `Совсем немного... Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Плюсую, но слишком много буквы! Планируете записать видосик на эту тему? Согласен с автором! Мне кажется или я уже читал это где-то?"`,
        UserId: 2
      },
      {
        text: `Совсем немного... Хочу такую же футболку :-) Планируете записать видосик на эту тему? Плюсую, но слишком много буквы! Мне кажется или я уже читал это где-то? Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Это где ж такие красоты?"`,
        UserId: 1
      },
      {
        text: `Мне кажется или я уже читал это где-то? Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Хочу такую же футболку :-) Согласен с автором! Планируете записать видосик на эту тему? Совсем немного..."`,
        UserId: 2
      },
      {
        text: `Хочу такую же футболку :-) Совсем немного... Мне кажется или я уже читал это где-то? Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Плюсую, но слишком много буквы! Планируете записать видосик на эту тему?"`,
        UserId: 1
      },
      {
        text: `Мне кажется или я уже читал это где-то? Планируете записать видосик на эту тему? Хочу такую же футболку :-) Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Это где ж такие красоты? Совсем немного... Плюсую, но слишком много буквы!"`,
        UserId: 2
      },
      {
        text: `Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Совсем немного... Планируете записать видосик на эту тему? Хочу такую же футболку :-) Согласен с автором! Это где ж такие красоты? Плюсую, но слишком много буквы!"`,
        UserId: 1
      }
    ],
    UserId: 1
  },
  {
    title: `Как собрать камни бесконечности`,
    announce: `Как начать действовать? Для начала просто соберитесь. Ещё никогда Штирлиц не был так близок к провалу. Первая большая ёлка была установлена только в 1938 году. Не было бы счастья, да несчастье помогло.`,
    fullText: `Не было бы счастья, да несчастье помогло. Дуракам закон не писан. Программировать не настолько сложно, как об этом говорят. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Первая большая ёлка была установлена только в 1938 году. Простые ежедневные упражнения помогут достичь успеха. Как начать действовать? Для начала просто соберитесь. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Достичь успеха помогут ежедневные повторения. Он написал больше 30 хитов. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравится только игры. Ещё никогда Штирлиц не был так близок к провалу. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Собрать камни бесконечности легко, если вы прирожденный герой. Смеркалось.`,
    pubDate: `2020-08-04 12:17:31`,
    categories: [`Фронтенд`, `Соцсети`, `Коты`, `Без рамки`, `Разное`, `IT`, `Железо`, `Программирование`, `Деревья`, `Дети`, `Отношения`],
    Comments: [
      {
        text: `Плюсую, но слишком много буквы! Совсем немного... Это где ж такие красоты? Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Планируете записать видосик на эту тему? Хочу такую же футболку :-) Давно не пользуюсь стационарными компьютерами. Ноутбуки победили."`,
        UserId: 1
      },
      {
        text: `Мне кажется или я уже читал это где-то? Плюсую, но слишком много буквы! Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Планируете записать видосик на эту тему? Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Это где ж такие красоты? Хочу такую же футболку :-)"`,
        UserId: 2
      },
      {
        text: `Это где ж такие красоты? Совсем немного... Плюсую, но слишком много буквы! Согласен с автором! Хочу такую же футболку :-) Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Мне кажется или я уже читал это где-то?"`,
        UserId: 1
      },
      {
        text: `Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Согласен с автором! Это где ж такие красоты? Хочу такую же футболку :-) Совсем немного... Мне кажется или я уже читал это где-то? Давно не пользуюсь стационарными компьютерами. Ноутбуки победили."`,
        UserId: 2
      },
      {
        text: `Хочу такую же футболку :-) Это где ж такие красоты? Совсем немного... Плюсую, но слишком много буквы! Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Планируете записать видосик на эту тему? Согласен с автором!"`,
        UserId: 1
      },
      {
        text: `Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Планируете записать видосик на эту тему? Плюсую, но слишком много буквы! Мне кажется или я уже читал это где-то? Это где ж такие красоты? Совсем немного..."`,
        UserId: 2
      }
    ],
    UserId: 2
  },
  {
    title: `Борьба с прокрастинацией`,
    announce: `Кролики — это не только ценный мех, но и 3-4 кг диетического легкоусвояемого мяса. Программировать не настолько сложно, как об этом говорят. Смеркалось. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле?`,
    fullText: `Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Не сделано — и переделывать не придется. Это один из лучших рок-музыкантов. Ёлки — это не просто красивое дерево. Это прочная древесина. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Из под его пера вышло 8 платиновых альбомов. Сижу за решеткой в темнице сырой. Вскормлённый в неволе орёл молодой... Как начать действовать? Для начала просто соберитесь. Дуракам закон не писан. Простые ежедневные упражнения помогут достичь успеха. Он написал больше 30 хитов. Первая большая ёлка была установлена только в 1938 году. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Достичь успеха помогут ежедневные повторения. Смеркалось. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравится только игры. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Золотое сечение — соотношение двух величин, гармоническая пропорция. Не было бы счастья, да несчастье помогло. Собрать камни бесконечности легко, если вы прирожденный герой.`,
    pubDate: `2020-10-05 12:17:31`,
    categories: [`Музыка`, `Программирование`, `Россия`, `Соцсети`, `За жизнь`, `Разное`],
    Comments: [
      {
        text: `Планируете записать видосик на эту тему? Плюсую, но слишком много буквы! Мне кажется или я уже читал это где-то? Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Совсем немного... Согласен с автором! Давно не пользуюсь стационарными компьютерами. Ноутбуки победили."`,
        UserId: 1
      },
      {
        text: `Совсем немного... Это где ж такие красоты? Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Планируете записать видосик на эту тему? Плюсую, но слишком много буквы! Согласен с автором! Мне кажется или я уже читал это где-то?"`,
        UserId: 2
      },
      {
        text: `Планируете записать видосик на эту тему? Мне кажется или я уже читал это где-то? Хочу такую же футболку :-) Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Это где ж такие красоты? Совсем немного..."`,
        UserId: 1
      },
      {
        text: `Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Совсем немного... Это где ж такие красоты? Планируете записать видосик на эту тему? Плюсую, но слишком много буквы! Мне кажется или я уже читал это где-то? Давно не пользуюсь стационарными компьютерами. Ноутбуки победили."`,
        UserId: 2
      },
      {
        text: `Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Планируете записать видосик на эту тему? Согласен с автором! Совсем немного... Это где ж такие красоты? Хочу такую же футболку :-) Плюсую, но слишком много буквы!"`,
        UserId: 1
      },
      {
        text: `Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Это где ж такие красоты? Хочу такую же футболку :-) Совсем немного... Планируете записать видосик на эту тему? Мне кажется или я уже читал это где-то?"`,
        UserId: 2
      },
      {
        text: `Хочу такую же футболку :-) Плюсую, но слишком много буквы! Совсем немного... Планируете записать видосик на эту тему? Мне кажется или я уже читал это где-то? Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Это где ж такие красоты?"`,
        UserId: 1
      }
    ],
    UserId: 1
  },
  {
    title: `Колобок, том 2`,
    announce: `Как начать действовать? Для начала просто соберитесь. Первая большая ёлка была установлена только в 1938 году. Достичь успеха помогут ежедневные повторения. Вы можете достичь всего. Стоит только немного постараться и запастись книгами.`,
    fullText: `Простые ежедневные упражнения помогут достичь успеха. Программировать не настолько сложно, как об этом говорят. Ещё никогда Штирлиц не был так близок к провалу. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравится только игры. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Он написал больше 30 хитов. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Не было бы счастья, да несчастье помогло. Первая большая ёлка была установлена только в 1938 году. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Золотое сечение — соотношение двух величин, гармоническая пропорция. Не сделано — и переделывать не придется. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Это один из лучших рок-музыкантов. Из под его пера вышло 8 платиновых альбомов. Кролики — это не только ценный мех, но и 3-4 кг диетического легкоусвояемого мяса. Собрать камни бесконечности легко, если вы прирожденный герой. Дуракам закон не писан. Как начать действовать? Для начала просто соберитесь. Сижу за решеткой в темнице сырой. Вскормлённый в неволе орёл молодой... Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете.`,
    pubDate: `2020-10-14 12:17:31`,
    categories: [`Россия`, `Программирование`],
    Comments: [
      {
        text: `Совсем немного... Хочу такую же футболку :-) Планируете записать видосик на эту тему? Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Плюсую, но слишком много буквы! Мне кажется или я уже читал это где-то? Согласен с автором!"`,
        UserId: 1
      },
      {
        text: `Это где ж такие красоты? Согласен с автором! Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Планируете записать видосик на эту тему? Совсем немного... Мне кажется или я уже читал это где-то? Плюсую, но слишком много буквы!"`,
        UserId: 2
      },
      {
        text: `Мне кажется или я уже читал это где-то? Это где ж такие красоты? Совсем немного... Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Хочу такую же футболку :-) Согласен с автором!"`,
        UserId: 1
      },
      {
        text: `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Согласен с автором! Планируете записать видосик на эту тему? Совсем немного... Мне кажется или я уже читал это где-то? Хочу такую же футболку :-)"`,
        UserId: 2
      },
      {
        text: `Плюсую, но слишком много буквы! Планируете записать видосик на эту тему? Мне кажется или я уже читал это где-то? Хочу такую же футболку :-) Совсем немного... Это где ж такие красоты? Мне не нравится ваш стиль. Ощущение, что вы меня поучаете."`,
        UserId: 1
      }
    ],
    UserId: 2
  },
  {
    title: `Интересные события в Санкт-Петербурге`,
    announce: `Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравится только игры. Ещё никогда Штирлиц не был так близок к провалу. Кролики — это не только ценный мех, но и 3-4 кг диетического легкоусвояемого мяса. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать.`,
    fullText: `Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много.\nВы можете достичь всего. Стоит только немного постараться и запастись книгами.`,
    pubDate: `2020-08-20 12:17:31`,
    categories: [`Деревья`, `Соцсети`, `Деньги`, `Кино`, `Коты`],
    Comments: [
      {
        text: `Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Планируете записать видосик на эту тему? Совсем немного... Плюсую, но слишком много буквы! Мне кажется или я уже читал это где-то? Согласен с автором! Это где ж такие красоты?"`,
        UserId: 2
      }
    ],
    UserId: 1
  }
];

const createAPI = async (logging = false) => {
  const mockDB = new Sequelize(`sqlite::memory:`, {logging});
  await initDB(mockDB, generateData({
    categories: mockCategories.slice(),
    articles: mockArticles.slice(),
    users: mockUsers.slice()
  }));
  const app = express();
  app.use(express.json());
  categories(app, new CategoriesService(mockDB));
  return app;
};

describe(`API returns category list`, () => {
  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app).get(`/categories`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(StatusCodes.OK));
  test(`Returns list of 16 categories`, () => expect(response.body.length).toBe(16));
  test(`Category names are "${mockCategories.join(`", "`)}"`, () => {
    expect(response.body.map((categoryData) => categoryData.title)).toEqual(expect.arrayContaining(mockCategories));
  });
});

describe(`API creates a category if data is valid`, () => {
  const newCategory = {
    title: `Валидное название категории`
  };
  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app).post(`/categories`).send(newCategory);
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(StatusCodes.CREATED));
  test(`Returns category created`, () => expect(response.body).toEqual(expect.objectContaining(newCategory)));
  test(`Categories count is changed`, () => request(app).get(`/categories`).expect((res) => {
    expect(res.body.length).toBe(17);
  }));
});

test(`API refuses to create a category when data is invalid, and returns status code 400`, async () => {
  const app = await createAPI();

  return request(app).post(`/categories`).send({}).expect(StatusCodes.BAD_REQUEST);
});

describe(`API correctly updates a category`, () => {
  const updatedCategory = {
    title: `Новый заголовок для категории`
  };

  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app).put(`/categories/1`).send(updatedCategory);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(StatusCodes.OK));
  test(`Returns category updated`, () => {
    return expect(response.body).toEqual(true);
  });
});

describe(`API correctly deletes a category`, () => {
  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app).delete(`/categories/1`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(StatusCodes.OK));
  test(`Categories count is 16 now`, () => request(app).get(`/categories`).expect((res) => {
    expect(res.body.length).toBe(16);
  }));
});

test(`API refuses to delete non-existent category`, async () => {
  const app = await createAPI();

  return request(app).delete(`/categories/999`).expect(StatusCodes.NOT_FOUND);
});
