const request = require('supertest');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const app = require('../index');
const db = require('../models');
const mongoose = require('mongoose');
const database = process.env.DB_URL;

let token;
let user;

beforeAll(async () => {
  // Connect to the test database
  await mongoose.connect(database, { useNewUrlParser: true });

  // Create a test user
  const hashedPassword = await bcrypt.hash('testpassword', 10);
  user = await db.utilizadores.create({
    username: 'testuser',
    password: hashedPassword,
    email: 'testuser@example.com',
    dataNascimento: '2000-01-01',
    morada: 'Test Address',
    localidade: 'Test City',
    codigoPostal: '12345',
    tipo: 'userNormal',
  });

  // Generate a test JWT token
  token = jwt.sign(
    {
      id: user._id,
      tipo: user.tipo,
      username: user.username,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '24h',
    }
  );
});

afterAll(async () => {
  // Delete the test user
  await db.utilizadores.findByIdAndDelete(user._id);

  // Disconnect from the database
  await db.disconnect();
});

describe('POST /users', () => {
  it('should register a new user', async () => {
    const response = await request(app)
      .post('/users')
      .send({
        username: 'newuser',
        password: 'newpassword',
        confirmPassword: 'newpassword',
        email: 'newuser@example.com',
        dataNascimento: '2000-01-01',
        morada: 'New Address',
        localidade: 'New City',
        codigoPostal: '54321',
        tipo: 'userNormal',
      })
      .expect(201);

    expect(response.body.success).toBe(true);
    expect(response.body.msg).toEqual('Utilizador newuser registado com sucesso!');
  });

  it('should return an error if required fields are missing', async () => {
    const response = await request(app).post('/users').send({}).expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body.msg).toEqual('Todos os campos são obrigatórios!');
  });

  // Add more tests for the registration endpoint
});

describe('POST users/login', () => {
  it('should log in a user', async () => {
    const response = await request(app)
      .post('/users/login')
      .send({
        email: 'user@gmail.com',
        password: 'Esmad_2223',
      })
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.msg).toEqual('Login efetuado com sucesso!');
    expect(response.body.token).toBeDefined();
  });

  it('should return an error if email is incorrect', async () => {
    const response = await request(app)
      .post('/users/login')
      .send({
        email: 'wrongemail@example.com',
        password: 'testpassword',
      })
      .expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body.msg).toEqual('Email incorreto!');
  });

  // Add more tests for the login endpoint
});

describe('GET /users', () => {
  it('should return all users', async () => {
    const response = await request(app)
      .get('/users')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.users).toBeDefined();
  });

  it('should return an error if user is not logged in', async () => {
    const response = await request(app).get('/users').expect(401);

    expect(response.body.success).toBe(false);
    expect(response.body.msg).toEqual('Utilizador não autenticado!');
  });
});

describe('GET /users/:id', () => {
  it('should return a user', async () => {
    const response = await request(app)
      .get(`/users/${user._id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.user).toBeDefined();
  });

  it('should return an error if user is not logged in', async () => {
    const response = await request(app).get(`/users/${user._id}`).expect(401);

    expect(response.body.success).toBe(false);
    expect(response.body.msg).toEqual('Utilizador não autenticado!');
  });
});

describe('PUT /users/:id', () => {
  it('should update a user', async () => {
    const response = await request(app)
      .put(`/users/${user._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        username: 'newuser',
        password: 'newpassword',
        confirmPassword: 'newpassword',
        email: 'new@email.com',
        dataNascimento: '2000-01-01',
        morada: 'New Address',
        localidade: 'New City',
        codigoPostal: '54321',
        tipo: 'userNormal',
      })
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.msg).toEqual('Utilizador atualizado com sucesso!');

    const updatedUser = await db.utilizadores.findById(user._id);
    expect(updatedUser.username).toEqual('newuser');
    expect(updatedUser.email).toEqual('new@email.com');
    expect(updatedUser.dataNascimento).toEqual('2000-01-01');
    expect(updatedUser.morada).toEqual('New Address');
    expect(updatedUser.localidade).toEqual('New City');
    expect(updatedUser.codigoPostal).toEqual('54321');
    expect(updatedUser.tipo).toEqual('userNormal');
  });

  it('should return an error if user is not logged in', async () => {
    const response = await request(app).put(`/users/${user._id}`).expect(401);

    expect(response.body.success).toBe(false);
    expect(response.body.msg).toEqual('Utilizador não autenticado!');
  });
});

describe('DELETE /users/:id', () => {
  it('should delete a user', async () => {
    const response = await request(app)
      .delete(`/users/${user._id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.msg).toEqual('Utilizador apagado com sucesso!');

    const deletedUser = await db.utilizadores.findById(user._id);
    expect(deletedUser).toBeNull();
  });

  it('should return an error if user is not logged in', async () => {
    const response = await request(app).delete(`/users/${user._id}`).expect(401);

    expect(response.body.success).toBe(false);
    expect(response.body.msg).toEqual('Utilizador não autenticado!');
  });
});
