const mongoose = require('mongoose');
const request = require('supertest');
const { app, server } = require('../index');
const jwt = require('jsonwebtoken');
const config = require('../config/db.config.js');
const database = process.env.DB_URL;

beforeAll(async () => {
  await mongoose.connect(database, { useNewUrlParser: true });
});

afterAll(async () => {
  await mongoose.disconnect();
  server.close();
});

describe('POST /ecopontos', () => {
  it('should create a new ecoponto and return the created resource', async () => {
    const response = await request(app)
      .post('/ecopontos')
      .field('nome', 'Ecoponto A')
      .field('morada', 'Sample Address')
      .field('localizacao', 'Sample Location')
      .field('dataCriacao', '2023-06-14')
      .field('latitude', '12.3456')
      .field('longitude', '78.9101')
      .field('tipo', 'Recycling')
      .attach('file', 'path/to/image.jpg');

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.msg).toBe('Novo registo de adição criado com sucesso!');
    expect(response.body.URL).toMatch(/\/adicaoEcopontos\/\w+/);
  });

  it('should return 400 if no photo is provided', async () => {
    const response = await request(app)
      .post('/ecopontos')
      .field('nome', 'Ecoponto A')
      .field('morada', 'Sample Address')
      .field('localizacao', 'Sample Location')
      .field('dataCriacao', '2023-06-14')
      .field('latitude', '12.3456')
      .field('longitude', '78.9101')
      .field('tipo', 'Recycling');

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.msg).toBe('Coloque uma foto.');
  });
});

describe('GET all ecopontos', () => {
  it('should return all ecopontos when no tipo parameter is provided', async () => {
    // Create some sample ecopontos in the database
    await db.ecopontos.create({
      nome: 'Ecoponto A',
      criador: 'user1',
      localizacao: 'Sample Location 1',
      morada: 'Sample Address 1',
      dataCriacao: '2023-06-14',
      foto: 'https://example.com/image1.jpg',
      latitude: '12.3456',
      longitude: '78.9101',
      tipo: 'Recycling',
      validacao: true,
    });
    await db.ecopontos.create({
      nome: 'Ecoponto B',
      criador: 'user2',
      localizacao: 'Sample Location 2',
      morada: 'Sample Address 2',
      dataCriacao: '2023-06-15',
      foto: 'https://example.com/image2.jpg',
      latitude: '12.3456',
      longitude: '78.9101',
      tipo: 'Composting',
      validacao: false,
    });

    const response = await request(app).get('/ecopontos');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.ecopontos.length).toBe(2);
  });

  it('should return filtered ecopontos when tipo parameter is provided', async () => {
    // Create some sample ecopontos in the database
    await db.ecopontos.create({
      nome: 'Ecoponto A',
      criador: 'user1',
      localizacao: 'Sample Location 1',
      morada: 'Sample Address 1',
      dataCriacao: '2023-06-14',
      foto: 'https://example.com/image1.jpg',
      latitude: '12.3456',
      longitude: '78.9101',
      tipo: 'Recycling',
      validacao: true,
    });
    await db.ecopontos.create({
      nome: 'Ecoponto B',
      criador: 'user2',
      localizacao: 'Sample Location 2',
      morada: 'Sample Address 2',
      dataCriacao: '2023-06-15',
      foto: 'https://example.com/image2.jpg',
      latitude: '12.3456',
      longitude: '78.9101',
      tipo: 'Composting',
      validacao: false,
    });

    const response = await request(app).get('/ecopontos').query({ tipo: 'Papel' });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.ecopontos.length).toBe(1);
    expect(response.body.ecopontos[0].tipo).toBe('Papel');
  });
});

describe('GET /ecopontos/:ecopointID', () => {
  it('should return the ecoponto with the given ID', async () => {
    const createdEcoponto = await db.ecopontos.create({
      nome: 'Ecoponto A',
      criador: 'user1',
      localizacao: 'Sample Location',
      morada: 'Sample Address',
      dataCriacao: '2023-06-14',
      foto: 'https://example.com/image.jpg',
      latitude: '12.3456',
      longitude: '78.9101',
      tipo: 'Recycling',
      validacao: true,
    });

    const response = await request(app).get(`/ecopontos/${createdEcoponto._id}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.ecoponto._id).toBe(String(createdEcoponto._id));
  });

  it('should return 404 if no ecoponto is found with the given ID', async () => {
    const response = await request(app).get('/api/ecopontos/invalidID');

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.msg).toMatch(/Não foi possível encontrar o ecoponto como o ID:/);
  });
});

describe('POST /ecopontos', () => {
  let userToken;

  beforeAll(async () => {
    // Create a user and generate a token for authentication
    await db.utilizadores.create({
      username: 'user1',
      password: 'password',
      tipo: 'user',
    });

    const loginResponse = await request(app)
      .post('/users/login')
      .send({ username: 'user1', password: 'password' });

    userToken = loginResponse.body.token;
  });

  it('should create a new ecoponto', async () => {
    const response = await request(app)
      .post('/ecopontos')
      .set('Authorization', `Bearer ${userToken}`)
      .field('nome', 'Ecoponto A')
      .field('localizacao', 'Sample Location')
      .field('morada', 'Sample Address')
      .field('dataCriacao', '2023-06-14')
      .field('tipo', 'Recycling')
      .attach('foto', 'path/to/image.jpg')
      .field('latitude', '12.3456')
      .field('longitude', '78.9101');

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.msg).toBe('Novo registo de adição criado com sucesso!');
    expect(response.body.URL).toMatch(/\/adicaoEcopontos\/\w+/);
  });

  it('should return 401 if user is not logged in', async () => {
    const response = await request(app).post('/ecopontos');

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.msg).toBe('Tem que estar logado para criar um novo ecoponto.');
  });

  it('should return 400 if no photo is provided', async () => {
    const response = await request(app)
      .post('/ecopontos')
      .set('Authorization', `Bearer ${userToken}`)
      .field('nome', 'Ecoponto A')
      .field('localizacao', 'Sample Location')
      .field('morada', 'Sample Address')
      .field('dataCriacao', '2023-06-14')
      .field('tipo', 'Recycling')
      .field('latitude', '12.3456')
      .field('longitude', '78.9101');

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.msg).toBe('Coloque uma foto.');
  });

  it('should return 400 if validation fails', async () => {
    const response = await request(app)
      .post('/ecopontos')
      .set('Authorization', `Bearer ${userToken}`)
      .field('nome', 'Ecoponto A')
      .field('localizacao', 'Sample Location')
      .field('morada', 'Sample Address')
      .field('dataCriacao', '2023-06-14')
      .field('tipo', 'Recycling')
      .attach('foto', 'path/to/image.jpg')
      .field('latitude', 'invalid')
      .field('longitude', '78.9101');

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.msg.length).toBeGreaterThan(0);
  });
});

describe('POST /api/ecopontos/:ecopontoID/validar', () => {
  let adminToken;
  let ecoponto;

  beforeAll(async () => {
    // Create an admin user and generate a token for authentication
    await db.utilizadores.create({
      username: 'admin',
      password: 'password',
      tipo: 'admin',
    });

    const loginResponse = await request(app)
      .post('users/login')
      .send({ username: 'admin', password: 'password' });

    adminToken = loginResponse.body.token;

    // Create an ecoponto for testing
    ecoponto = await db.ecopontos.create({
      nome: 'Ecoponto A',
      criador: 'user1',
      localizacao: 'Sample Location',
      morada: 'Sample Address',
      dataCriacao: '2023-06-14',
      foto: 'https://example.com/image.jpg',
      latitude: '12.3456',
      longitude: '78.9101',
      tipo: 'Recycling',
      validacao: false,
    });
  });

  it('should validate the ecoponto', async () => {
    const response = await request(app)
      .post(`/ecopontos/${ecoponto._id}/validar`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.msg).toBe('Ecoponto validado com sucesso.');
  });

  it('should return 401 if user is not an admin', async () => {
    const userToken = await generateUserToken();

    const response = await request(app)
      .post(`/ecopontos/validacao/${ecoponto._id}`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.msg).toBe('Apenas administradores podem validar um ecoponto.');
  });

  it('should return 404 if no ecoponto is found with the given ID', async () => {
    const response = await request(app)
      .post('/ecopontos/validacao/invalidID')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.msg).toMatch(/Não foi possível encontrar o ecoponto com o ID:/);
  });
});
