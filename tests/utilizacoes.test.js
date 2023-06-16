const mongoose = require('mongoose');
const request = require('supertest');
const { app, server } = require('../index');
const jwt = require('jsonwebtoken');
const config = require('../config/db.config.js');
const database = config.URL;

let token; // Declare a variable to store the token
let userID; // Declare a variable to store the user ID
let adminToken; // Declare a variable to store the admin token
let adminID; // Declare a variable to store the admin ID

beforeAll(async () => {
  await mongoose.connect(database, { useNewUrlParser: true });
});

afterAll(async () => {
  // Disconnect from the database and close the server
  await mongoose.disconnect();
  server.close();
});

describe('Autenticação', () => {
  test('Login de utilizador', async () => {
    const response = await request(app).post('/users/login').send({
      email: 'user@gmail.com',
      password: 'Esmad_2223',
    });
    expect(response.statusCode).toBe(200);
    token = response.body.token; // Save the token!
    let decode = jwt.verify(token, config.SECRET);
    userID = decode.id;
  });
  test('Login de admin', async () => {
    const response = await request(app).post('/users/login').send({
      email: 'admin@gmail.com',
      password: 'Esmad_2223',
    });
    expect(response.statusCode).toBe(200);
    adminToken = response.body.token; // Save the token!
    let decode = jwt.verify(adminToken, config.SECRET);
    adminID = decode.id;
  });
});

describe('Testes de utilização', () => {
  test('Criar utilização', async () => {
    const response = await request(app)
      .post('/utilizacoes')
      .send({
        idUtilizador: userID,
        idEcoponto: '646376c2cf32f08ae1f73257',
        dataUtilizacao: '2021-06-04T00:00:00.000Z',
        foto: '../tmp/1686773185325-ecoponto.png',
        validacao: false,
      })
      .set('Authorization', `Bearer ${adminToken}`);
    expect(response.statusCode).toBe(200);
  });
  test('Criar utilização com dados em falta', async () => {
    const response = await request(app)
      .post('/utilizacoes')
      .send({
        idUtilizador: userID,
        idEcoponto: '646376c2cf32f08ae1f73257',
        dataUtilizacao: '2021-06-04T00:00:00.000Z',
        foto: 'https://i.imgur.com/3QZQ0Jj.jpg',
      })
      .set('Authorization', `Bearer ${adminToken}`);
    expect(response.statusCode).toBe(400);
  });
  test('Tentar criar utilização como userNormal', async () => {
    const response = await request(app)
      .post('/utilizacoes')
      .send({
        idUtilizador: userID,
        idEcoponto: '646376c2cf32f08ae1f73257',
        dataUtilizacao: '2021-06-04T00:00:00.000Z',
        foto: 'https://i.imgur.com/3QZQ0Jj.jpg',
        validacao: false,
      })
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(401);
  });
});
