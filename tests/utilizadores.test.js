const mongoose = require('mongoose');
const request = require('supertest');
const { app, server } = require('../index');
const jwt = require('jsonwebtoken');
const config = require('../config/db.config.js');
const User = require('../models/utilizadores.model.js');

const database = config.URL;

beforeAll(async () => {
  await mongoose.connect(database, { useNewUrlParser: true });
});

afterAll(async () => {
  await mongoose.disconnect();
  server.close();
});

describe('Registar utilizador', () => {
  test('Todos os campos são obrigatórios', async () => {
    const response = await request(app).post('/users').send({
      username: '',
      password: '',
      confirmPassword: '',
      email: '',
      dataNascimento: '',
      morada: '',
      localidade: '',
      codigoPostal: '',
      tipo: '',
    });
    expect(response.status).toBe(400);
  });

  /* create a test user */
  test('Criar um novo utilizador', async () => {
    const response = await request(app).post('/users').send({
      username: 'userTest',
      password: 'Esmad_2223',
      confirmPassword: 'Esmad_2223',
      email: 'userTest@gmail.com',
      dataNascimento: '2002-01-12',
      morada: 'Rua João de Deus',
      localidade: 'Vila Nova de Gaia',
      codigoPostal: '4400-182',
    });
    expect(response.status).toBe(201);
  }, 10000);

  test('Username já existe', async () => {
    const response = await request(app).post('/users').send({
      username: 'userTest',
      password: 'Esmad_2223',
      confirmPassword: 'Esmad_2223',
      email: 'userTest1@gmail.com',
      dataNascimento: '2002-01-12',
      morada: 'Rua João de Deus',
      localidade: 'Vila Nova de Gaia',
      codigoPostal: '4400-182',
    });
    expect(response.status).toBe(400);
  });

  test('Email já existe', async () => {
    const response = await request(app).post('/users').send({
      username: 'userTest2',
      password: 'Esmad_2223',
      confirmPassword: 'Esmad_2223',
      email: 'userTest@gmail.com',
      dataNascimento: '2002-01-12',
      morada: 'Rua João de Deus',
      localidade: 'Vila Nova de Gaia',
      codigoPostal: '4400-182',
    });
    expect(response.status).toBe(400);
  });

  test('Password e confirmPassword não são iguais', async () => {
    const response = await request(app).post('/users').send({
      username: 'userTest3',
      password: 'Esmad_2223',
      confirmPassword: 'Esmad_2224',
      email: 'userTest3@gmail.com',
      dataNascimento: '2002-01-12',
      morada: 'Rua João de Deus',
      localidade: 'Vila Nova de Gaia',
      codigoPostal: '4400-182',
    });
    expect(response.status).toBe(400);
  });
});

describe('Login utilizador', () => {
  test('Email e Password são obrigatórios', async () => {
    const response = await request(app).post('/users/login').send({
      email: '',
      password: '',
    });
    expect(response.status).toBe(400);
  });

  test('Email não existe ou incorreto', async () => {
    const response = await request(app).post('/users/login').send({
      email: 'example@domain.com',
      password: 'Esmad_2223',
    });
    expect(response.status).toBe(400);
  });

  test('Password incorreta', async () => {
    const response = await request(app).post('/users/login').send({
      email: 'userTest@gmail.com',
      password: 'Esmad_2224',
    });
    expect(response.status).toBe(400);
  });

  test('Login com sucesso', async () => {
    const response = await request(app).post('/users/login').send({
      email: 'userTest@gmail.com',
      password: 'Esmad_2223',
    });
    expect(response.status).toBe(200);
  });
});

describe('Atualizar utilizador', () => {
  test('Todos os campos são obrigatórios', async () => {
});