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
let ecopontoID = '6463459d4352679983075814';
beforeAll(async () => {
  await mongoose.connect(database, { useNewUrlParser: true });
});

afterAll(async () => {
  //Set the validation back to false
  await request(app)
    .put(`/ecopontos/validacao/648a1dd09c24a59da6abd38a`)
    .set('Authorization', `Bearer ${adminToken}`)
    .send({
      validado: false,
    });

  // Disconnect from the database and close the server
  await mongoose.disconnect();
  server.close();
});

describe('Listagem de ecopontos', () => {
  /* efetuar login como user */
  test('Login como user', async () => {
    const response = await request(app).post('/users/login').send({
      email: 'user@gmail.com',
      password: 'Esmad_2223',
    });
    expect(response.status).toBe(200);
    token = response.body.token; // Update the token value
    let decode = jwt.verify(response.body.token, config.SECRET); // Decode the token
    userID = decode.id; // Get the user ID
  }, 10000);

  test('Listar todos os ecopontos', async () => {
    const response = await request(app).get('/ecopontos').set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
  }, 10000);

  test('Listar ecopontos por ID', async () => {
    const response = await request(app)
      .get(`/ecopontos/${ecopontoID}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
  });

  test('Listar ecoponto com ID inválido', async () => {
    const response = await request(app)
      .get(`/ecopontos/5f9e1b3c6c6b4c2a3c6b4c2a`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(404);
  });
  /* test for error 500 */
  test('Listar ecoponto com ID inválido', async () => {
    const response = await request(app)
      .get(`/ecopontos/5f9e1b3c6c6b4c2a3c6b4c2`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(500);
  });
});

describe('Criação de Ecopontos', () => {
  test('Criar um novo mas sem fotografia', async () => {
    const response = await request(app)
      .post('/ecopontos/adicaoEcoponto')
      .set('Authorization', `Bearer ${token}`)
      .send({
        nome: 'Ecoponto Teste',
        morada: 'Rua de Testes',
        localizacao: 'Vila Nova de Gaia',
        codigoPostal: '4400-182',
        latitude: '41.1785',
        longitude: '-8.6081',
        tipo: 'vidro',
      });
    expect(response.status).toBe(400);
  });

  test('Todos os capos são obrigatórios', async () => {
    const response = await request(app)
      .post('/ecopontos/adicaoEcoponto')
      .set('Authorization', `Bearer ${token}`)
      .send({
        nome: '',
        morada: '',
        localizacao: '',
        codigoPostal: '',
        latitude: '',
        longitude: '',
        tipo: '',
      });
    expect(response.status).toBe(400);
  });
});

describe('Funções de Administrador para os Ecopontos', () => {
  test('Login como admin', async () => {
    const response = await request(app).post('/users/login').send({
      email: 'admin@gmail.com',
      password: 'Esmad_2223',
    });
    expect(response.status).toBe(200);
    adminToken = response.body.token; // Update the token value
    let decode = jwt.verify(response.body.token, config.SECRET); // Decode the token
    adminID = decode.id; // Get the user ID
  }, 10000);

  test('Validar um ecoponto', async () => {
    const response = await request(app)
      .put(`/ecopontos/validacao/648a1dd09c24a59da6abd38a`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        validacao: true,
      });

    expect(response.status).toBe(200);
  });

  test('Validar um ecoponto com ID inválido', async () => {
    const response = await request(app)
      .put(`/ecopontos/validacao/648a1dd09c24a59da6abd38`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        validacao: true,
      });

    expect(response.status).toBe(500);
  });

  test('Validar como userNormal', async () => {
    const response = await request(app)
      .put(`/ecopontos/validacao/648a1dd09c24a59da6abd38a`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        validacao: true,
      });

    expect(response.status).toBe(403);
  });

  test('Validar um ecoponto com ID inválido', async () => {
    const response = await request(app)
      .put(`/ecopontos/validacao/648a1dd09c24a59da6abd38`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        validacao: true,
      });

    expect(response.status).toBe(500);
  });
});
