const mongoose = require('mongoose');
const request = require('supertest');
const { app, server } = require('../index');
const jwt = require('jsonwebtoken');
const config = require('../config/db.config.js');
const { getAllUsers } = require('../controllers/utilizadores.controller');

const database = config.URL;

let token; // Declare a variable to store the token
let userID; // Declare a variable to store the user ID
let adminToken; // Declare a variable to store the admin token
let adminID; // Declare a variable to store the admin ID

beforeAll(async () => {
  await mongoose.connect(database, { useNewUrlParser: true });
});

afterAll(async () => {
  // Delete the userTest user
  if (userID != null) {
    await request(app).delete(`/users/${userID}`).set('Authorization', `Bearer ${token}`);
  }
  // Disconnect from the database and close the server
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
    token = response.body.token; // Update the token value
    let decode = jwt.verify(response.body.token, config.SECRET); // Decode the token
    userID = decode.id; // Get the user ID
    return userID;
  });
});

describe('Perfil de Utilzador', () => {
  test('Ver perfil de utilizador', async () => {
    const response = await request(app)
      .get(`/users/perfil/${userID}`)
      .set('Authorization', 'Bearer ' + token);
    expect(response.status).toBe(200);
  });

  test('Sem permissão para ver perfil de utilizador', async () => {
    const response = await request(app)
      .get(`/users/perfil/5f9e1b3c6c6b4c2a3c6b4c2a`)
      .set('Authorization', 'Bearer ' + token);
    expect(response.status).toBe(403);
  });
});

describe('Atualizar utilizador', () => {
  test('Todos os campos são obrigatórios', async () => {
    const response = await request(app)
      .patch(`/users/${userID}`)
      .set('Authorization', 'Bearer ' + token)
      .send({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
      });
    expect(response.status).toBe(400);
  });

  test('ID de utilizador não existe', async () => {
    const response = await request(app)
      .patch(`/users/5f9e1b3c6c6b4c2a3c6b4c2a`)
      .set('Authorization', 'Bearer ' + token)
      .send({
        username: 'userTestUpdate',
        email: 'userTest@gmail.com',
        password: 'Esmad_2223',
        confirmPassword: 'Esmad_2223',
      });
    expect(response.status).toBe(404);
  });

  test('Atualizar utilizador com sucesso', async () => {
    const response = await request(app)
      .patch(`/users/${userID}`)
      .set('Authorization', 'Bearer ' + token)
      .send({
        username: 'userTestUpdate',
        email: 'userTest@gmail.com',
        password: 'Esmad_2223',
        confirmPassword: 'Esmad_2223',
      });
    expect(response.status).toBe(200);
  });
});

describe('Funções de administrador', () => {
  test('Login com sucesso', async () => {
    const response = await request(app).post('/users/login').send({
      email: 'admin@gmail.com',
      password: 'Esmad_2223',
    });
    expect(response.status).toBe(200);
    adminToken = response.body.token; // Update the token value
    let decode = jwt.verify(response.body.token, config.SECRET); // Decode the token
    adminID = decode.id; // Get the user ID
    console.log(response.body);
  });

  test('Listar todos os utilizadores', async () => {
    const response = await request(app)
      .get('/users')
      .set('Authorization', 'Bearer ' + adminToken);
    expect(response.status).toBe(200);
  });

  test('Sem permissão para listar todos os utilizadores', async () => {
    const response = await request(app)
      .get('/users')
      .set('Authorization', 'Bearer ' + token);
    expect(response.status).toBe(403);
    console.log(response.body);
  });

  test('Apagar Utilizador', async () => {
    const response = await request(app)
      .delete(`/users/${userID}`)
      .set('Authorization', 'Bearer ' + adminToken);
    expect(response.status).toBe(200);
  });
});
