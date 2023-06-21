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
  test('Criar utilização com dados em falta', async () => {
    const response = await request(app)
      .post('/utilizacoes')
      .send({
        idUtilizador: userID,
        idEcoponto: '646376c2cf32f08ae1f73257',
        dataUtilizacao: '2021-06-04T00:00:00.000Z',
      })
      .set('Authorization', `Bearer ${adminToken}`);
    expect(response.statusCode).toBe(400);
  });

  test('Listar todas as utilizações validadas', async () => {
    const response = await request(app)
      .get('/utilizacoes/validados')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(response.statusCode).toBe(200);
  });

  test('Tentar listar todas as utilizações sem ser admin', async () => {
    const response = await request(app)
      .get('/utilizacoes/validados')
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(403);
  });

  test('Listar todas as utilizações não validadas', async () => {
    const response = await request(app)
      .get('/utilizacoes/naoValidados')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(response.statusCode).toBe(200);
  });

  test('Tentar listar todas as utilizações sem ser admin', async () => {
    const response = await request(app)
      .get('/utilizacoes/naoValidados')
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(403);
  });

  test('Listar utilização por ID', async () => {
    const response = await request(app)
      .get('/utilizacoes/64636f40435267998314550e')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(response.statusCode).toBe(200);
  });

  test('Tentar listar utilização por ID sem ser admin', async () => {
    const response = await request(app)
      .get('/utilizacoes/64636f40435267998314550e')
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(403);
  });
});

describe('Validação de Utilizações', () => {
  test('Validar utilização', async () => {
    const response = await request(app)
      .put('/utilizacoes/validacao/64636f40435267998314550e')
      .send({
        validado: true,
      })
      .set('Authorization', `Bearer ${adminToken}`);
    expect(response.statusCode).toBe(200);
  });

  test('Tentar validar utilização sem ser admin', async () => {
    const response = await request(app)
      .put('/utilizacoes/validacao/64636f40435267998314550e')
      .send({
        validado: true,
      })
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(403);
  });
});
