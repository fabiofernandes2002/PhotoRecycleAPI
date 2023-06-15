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

let desafioID; // Declare a variable to store the desafio ID

beforeAll(async () => {
  await mongoose.connect(database, { useNewUrlParser: true });
});

afterAll(async () => {
  // Disconnect from the database and close the server
  await mongoose.disconnect();
  server.close();
});

describe('Listar Desafios', () => {
  test('Login como utilizador', async () => {
    const response = await request(app).post('/users/login').send({
      email: 'user@gmail.com',
      password: 'Esmad_2223',
    });
    expect(response.statusCode).toBe(200);
    token = response.body.token; // save the token!
    let decode = jwt.verify(token, config.SECRET);
    userID = decode.id;
  }, 10000);

  test('Listar todos os desafios', async () => {
    const response = await request(app).get('/desafios').set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
  });

  test('Listar apenas um desafio', async () => {
    const response = await request(app)
      .get('/desafios/64636c334352679983136162')
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
  });

  test('Listar desafio com ID inválido', async () => {
    const response = await request(app)
      .get('/desafios/5f9e1b3c6c6b4c2a3c6b4c2a')
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(404);
  });
});

describe('Funções de Administrador', () => {
  test('Login como administrador', async () => {
    const response = await request(app).post('/users/login').send({
      email: 'admin@gmail.com',
      password: 'Esmad_2223',
    });
    expect(response.statusCode).toBe(200);
    adminToken = response.body.token; // save the token!
    let decode = jwt.verify(adminToken, config.SECRET);
    adminID = decode.id;
  });

  test('Criar um novo desafio', async () => {
    const response = await request(app)
      .post('/desafios')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        nome: 'Desafio Teste',
        descricao: 'Descrição do desafio teste',
        recompensa: 100,
      });
    expect(response.statusCode).toBe(201);
    desafioID = response.body.id;
  });

  test('Verificar se o desafio já existe', async () => {
    const response = await request(app)
      .post('/desafios')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        nome: 'Desafio Teste',
        descricao: 'Descrição do desafio teste',
        recompensa: 100,
      });
    expect(response.statusCode).toBe(400);
  });

  test('Tentar criar um desafio como userNormal', async () => {
    const response = await request(app)
      .post('/desafios')
      .set('Authorization', `Bearer ${token}`)
      .send({
        nome: 'Desafio Teste Normal',
        descricao: 'Descrição do desafio teste normal',
        recompensa: 200,
      });
    expect(response.statusCode).toBe(403);
  });

  test('Tentar atualizar um desafio como userNormal', async () => {
    const response = await request(app)
      .put(`/desafios/${desafioID}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        nome: 'Desafio Teste Normal',
        descricao: 'Descrição do desafio teste normal',
        recompensa: 200,
      });
    expect(response.statusCode).toBe(403);
  });

  test('Atualizar um desafio de forma errada', async () => {
    const response = await request(app)
      .put(`/desafios/${desafioID}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        nome: '',
        descricao: '',
        recompensa: '',
      });
    expect(response.statusCode).toBe(400);
  });

  test('Atualizar um desafio com ID inválido', async () => {
    const response = await request(app)
      .put('/desafios/5f9e1b3c6c6b4c2a3c6b4c2a')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        nome: 'Desafio Teste Atualizado',
        descricao: 'Descrição do desafio teste',
        recompensa: 100,
      });
    expect(response.statusCode).toBe(404);
  });

  test('Atualizar um desafio de forma correta', async () => {
    const response = await request(app)
      .put(`/desafios/${desafioID}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        nome: 'Desafio Teste Atualizado',
        descricao: 'Descrição do desafio teste',
        recompensa: 100,
      });
    expect(response.statusCode).toBe(200);
  });

  test('Tentar eliminar um desafio como userNormal', async () => {
    const response = await request(app)
      .delete(`/desafios/${desafioID}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(403);
  });

  test('Eliminar um desafio com ID inválido', async () => {
    const response = await request(app)
      .delete('/desafios/5f9e1b3c6c6b4c2a3c6b4c2a')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(response.statusCode).toBe(404);
  });

  test('Eliminar um desafio', async () => {
    const response = await request(app)
      .delete(`/desafios/${desafioID}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(response.statusCode).toBe(200);
  });
});
