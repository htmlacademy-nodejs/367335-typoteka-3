'use strict';

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);
const {StatusCodes} = require(`http-status-codes`);
const initDB = require(`../lib/init-db`);
const users = require(`./users`);
const UsersService = require(`../data-services/users`);

const sampleUser = {
  firstName: `Сидор`,
  lastName: `Сидоров`,
  email: `sidorov@example.com`,
  password: `sidorov`,
  passwordRepeated: `sidorov`,
  avatar: `sidorov.jpg`
};
const secondUser = {
  // дополнительный пользователь для проверки уникальности e-mail
  firstName: `Иван`,
  lastName: `Иванов`,
  email: `ivanov@example.com`,
  password: `ivanov`,
  passwordRepeated: `ivanov`,
  avatar: `ivanov.jpg`
};

const createAPI = async (logging = false) => {
  const mockDB = new Sequelize(`sqlite::memory:`, {logging});
  await initDB(mockDB);
  const app = express();
  app.use(express.json());
  users(app, new UsersService(mockDB));

  return app;
};

describe(`API creates user if data is valid`, () => {
  let response;

  beforeAll(async () => {
    let app = await createAPI();
    response = await request(app)
      .post(`/user`)
      .send({...sampleUser});
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(StatusCodes.CREATED));
});

describe(`API refuses to create user if data is invalid`, () => {
  let app;

  beforeAll(async () => {
    app = await createAPI();
    await request(app)
      .post(`/user`)
      .send(secondUser);
  });

  test(`Without any required property response code is 400`, async () => {
    Object.keys(sampleUser).forEach(async (key) => {
      const badUserData = {...sampleUser};
      delete badUserData[key];
      await request(app)
        .post(`/user`)
        .send(badUserData)
        .expect(StatusCodes.BAD_REQUEST);
    });
  });

  test(`When field type is wrong response code is 400`, async () => {
    const badUsers = [
      {...sampleUser, firstName: true},
      {...sampleUser, email: 1}
    ];
    badUsers.forEach(async (badUserData) => {
      await request(app)
        .post(`/user`)
        .send(badUserData)
        .expect(StatusCodes.BAD_REQUEST);
    });
  });

  test(`When field value is wrong response code is 400`, async () => {
    const badUsers = [
      {...sampleUser, password: `short`, passwordRepeated: `short`},
      {...sampleUser, email: `invalid`}
    ];
    badUsers.forEach(async (badUserData) => {
      await request(app)
        .post(`/user`)
        .send(badUserData)
        .expect(StatusCodes.BAD_REQUEST);
    });
  });

  test(`When password and passwordRepeated are not equal, code is 400`, async () => {
    const badUserData = {...sampleUser, passwordRepeated: `not sidorov`};
    await request(app)
      .post(`/user`)
      .send(badUserData)
      .expect(StatusCodes.BAD_REQUEST);
  });

  test(`When email is already in use status code is 400`, async () => {
    const badUserData = {...sampleUser, email: `ivanov@example.com`};
    await request(app)
      .post(`/user`)
      .send(badUserData)
      .expect(StatusCodes.BAD_REQUEST);
  });
});

describe(`API authenticate user if data is valid`, () => {
  const validAuthData = {
    email: `ivanov@example.com`,
    password: `ivanov`
  };

  let response;

  beforeAll(async () => {
    const app = await createAPI();
    await request(app)
      .post(`/user`)
      .send(secondUser);
    response = await request(app)
      .post(`/user/auth`)
      .send(validAuthData);
  });

  test(`Status code is 200`, () => expect(response.statusCode).toBe(StatusCodes.OK));

  test(`User name is Иван Иванов`, () => {
    const {firstName, lastName} = response.body;

    expect(firstName).toBe(`Иван`);
    expect(lastName).toBe(`Иванов`);
  });
});

describe(`API refuses to authenticate user if data is invalid`, () => {
  let app;

  beforeAll(async () => {
    app = await createAPI();
  });

  test(`If email is incorrect status is 401`, async () => {
    const badAuthData = {
      email: `not-exist@example.com`,
      password: `petrov`
    };
    await request(app)
      .post(`/user/auth`)
      .send(badAuthData)
      .expect(StatusCodes.UNAUTHORIZED);
  });

  test(`If password doesn't match status is 401`, async () => {
    const badAuthData = {
      email: `ivanov@example.com`,
      password: `petrov`
    };
    await request(app)
      .post(`/user/auth`)
      .send(badAuthData)
      .expect(StatusCodes.UNAUTHORIZED);
  });
});
