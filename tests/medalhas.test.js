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

let medalhaID; // Declare a variable to store the medalha ID

beforeAll(async () => {
  await mongoose.connect(database, { useNewUrlParser: true });
});

afterAll(async () => {
  // Disconnect from the database and close the server
  await mongoose.disconnect();
  server.close();
});

describe('Autenticação', () => {
  test('Login de administrador', async () => {
    const response = await request(app).post('/users/login').send({
      email: 'admin@gmail.com',
      password: 'Esmad_2223',
    });
    expect(response.status).toBe(200);
    adminToken = response.body.token;
    let decode = jwt.verify(adminToken, config.SECRET);
    adminID = decode.id;
  }, 10000);

  test('Login de userNormal', async () => {
    const response = await request(app).post('/users/login').send({
      email: 'user@gmail.com',
      password: 'Esmad_2223',
    });
    expect(response.status).toBe(200);
    token = response.body.token;
    let decode = jwt.verify(token, config.SECRET);
    userID = decode.id;
  }, 10000);
});

describe('Criação de Medalhas', () => {
  test('Criar uma medalha', async () => {
    const response = await request(app)
      .post('/medalhas')
      .send({
        nomeMedalha: 'Medalha Teste',
        urlMedalha: 'https://www.google.com',
        pontos: 100,
      })
      .set('Authorization', 'Bearer ' + adminToken);
    expect(response.status).toBe(201);
    medalhaID = response.body.URL;
  });

  test('Tentar criar uma medalha como userNormal', async () => {
    const response = await request(app)
      .post('/medalhas')
      .send({
        nomeMedalha: 'Medalha Teste',
        urlMedalha: 'https://www.google.com',
        pontos: 100,
      })
      .set('Authorization', 'Bearer ' + token);
    expect(response.status).toBe(403);
  });

  test('Tentar criar uma medalha com dados inválidos', async () => {
    const response = await request(app)
      .post('/medalhas')
      .send({
        nomeMedalha: 'Medalha Teste',
        urlMedalha: 'https://www.google.com',
        pontos: 'abc',
      })
      .set('Authorization', 'Bearer ' + adminToken);
    expect(response.status).toBe(400);
  });
});

describe('Listar medalhas', () => {
  test('Listar todas as medalhas', async () => {
    const response = await request(app).get('/medalhas');
    expect(response.status).toBe(200);
  }, 10000);

  test('Listar uma medalha', async () => {
    const response = await request(app)
      .get(`/medalhas/${medalhaID}`)
      .set('Authorization', 'Bearer ' + adminToken);
    expect(response.status).toBe(200);
  });

  test('Tentar listar uma medalha como userNormal', async () => {
    const response = await request(app)
      .get(`/medalhas/${medalhaID}`)
      .set('Authorization', 'Bearer ' + token);
    expect(response.status).toBe(403);
  });

  test('Tentar listar uma medalha inexistente', async () => {
    const response = await request(app)
      .get(`/medalhas/5f8b8a2f7f6c6a1f1c9d7e8f`)
      .set('Authorization', 'Bearer ' + adminToken);
    expect(response.status).toBe(404);
  });
});

describe('Atualizar medalhas', () => {
  test('Atualizar uma medalha', async () => {
    const response = await request(app)
      .put(`/medalhas/${medalhaID}`)
      .send({
        nomeMedalha: 'Medalha Teste',
        urlMedalha: 'https://www.google.com',
        pontos: 200,
      })
      .set('Authorization', 'Bearer ' + adminToken);
    expect(response.status).toBe(200);
  });

  test('Tentar atualizar uma medalha como userNormal', async () => {
    const response = await request(app)
      .put(`/medalhas/${medalhaID}`)
      .send({
        nomeMedalha: 'Medalha Teste',
        urlMedalha: 'https://www.google.com',
        pontos: 200,
      })
      .set('Authorization', 'Bearer ' + token);
    expect(response.status).toBe(403);
  });

  test('Tentar atualizar uma medalha com dados inválidos', async () => {
    const response = await request(app)
      .put(`/medalhas/${medalhaID}`)
      .send({
        nomeMedalha: 'Medalha Teste',
        urlMedalha: '',
        pontos: '123',
      })
      .set('Authorization', 'Bearer ' + adminToken);
    expect(response.status).toBe(400);
  });

  test('Tentar atualizar uma medalha inexistente', async () => {
    const response = await request(app)
      .put(`/medalhas/5f8b8a2f7f6c6a1f1c9d7e8f`)
      .send({
        nomeMedalha: 'Medalha Teste',
        urlMedalha: 'https://www.google.com',
        pontos: 200,
      })
      .set('Authorization', 'Bearer ' + adminToken);
    expect(response.status).toBe(404);
  });
});

describe('Apagar medalhas', () => {
  test('Apagar uma medalha inexistente', async () => {
    const response = await request(app)
      .delete(`/medalhas/5f8b8a2f7f6c6a1f1c9d7e8f`)
      .set('Authorization', 'Bearer ' + adminToken);
    expect(response.status).toBe(404);
  });

  test('Tentar apagar uma medalha como userNormal', async () => {
    const response = await request(app)
      .delete(`/medalhas/${medalhaID}`)
      .set('Authorization', 'Bearer ' + token);
    expect(response.status).toBe(403);
  });

  test('Apagar uma medalha', async () => {
    const response = await request(app)
      .delete(`/medalhas/${medalhaID}`)
      .set('Authorization', 'Bearer ' + adminToken);
    expect(response.status).toBe(200);
  });
});
