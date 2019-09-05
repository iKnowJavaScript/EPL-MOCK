const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../index');
const User = require('../api/models/User.model');
let { user1, user2, fakeUser } = require('./dummy_data').users;

let user;
let registeredUser;

beforeEach(async () => {
  await User.deleteMany().exec();
  user = await User.create({
    name: 'Victor',
    email: 'firstUser@yahoo.com',
    password: '22222222',
    favoriteTeam: 'Arsenal'
  });
});

afterAll(async () => {
  await User.deleteMany();
  mongoose.connection.close();
});

describe('Checking basic routes', () => {
  it('should render properly with valid parameters', async () => {
    await request(app)
      .get('/api/v1/health-check/')
      .then(res => {
        expect(res.text).toMatch(/OK/);
        expect(res.status).toBe(200);
      });
  });
  it('should render properly', async () => {
    await request(app)
      .get('/')
      .then(res => {
        expect(res.status).toBe(200);
      });
  });
});

describe('Testing User routes', () => {
  describe('Testing the POST route, Creating user', () => {
    it('Should be able to add new user', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send(user1)
        .expect(200);
      expect(response.body.payload).toMatchObject({
        id: expect.any(String),
        name: expect.any(String),
        email: expect.any(String),
        isAdmin: expect.any(Boolean)
      });
      expect(response.body.statusCode).toBe(200);
      expect(response.body.message).toBeDefined();
      expect(response.body.error).toBe(null);
      expect(response.body.token).toBeDefined();
    });
    it('Shoud return a validation error if user details is not correct', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send(fakeUser)
        .expect(200);
      const { statusCode, message, errors } = response.body;
      expect(statusCode).toBe(400);
      expect(message).toMatch(/invalid fields/i);
      expect(errors).toBeDefined;
    });
    it('Should not be able to add user with thesame email address', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'anotherVictor',
          email: 'firstUser@yahoo.com',
          password: '22222222'
        })
        .expect(200);
      const { statusCode, message, error } = response.body;
      expect(statusCode).toBe(400);
      expect(message).toMatch(/email has been taken/i);
      expect(error).toBeDefined();
    });
  });
  describe('Registered user should be able to sign in', () => {
    it('Registered user should be able to log in', async () => {
      const register = await request(app)
        .post('/api/v1/auth/register')
        .send(user2);
      registeredUser = register.body;

      const { email } = registeredUser.payload;

      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({ email, password: user2.password })
        .expect(200);
      const { payload, message, token, statusCode, error } = response.body;
      expect(payload).toMatchObject({
        id: expect.any(String),
        name: expect.any(String),
        email: expect.any(String),
        isAdmin: expect.any(Boolean),
        isDeleted: expect.any(Boolean)
      });
      expect(statusCode).toBe(200);
      expect(message).toBeDefined();
      expect(error).toBe(false);
      expect(token).toBeDefined();
    });
  });
  describe('Register user should be able to View COmpleted/Pending fixtures', () => {
    it('Should be able to get all COMPLETED fixtures', async () => {
      const register = await request(app)
        .post('/api/v1/auth/register')
        .send(user2);
      registeredUser = register.body;

      const response = await request(app)
        .get('/api/v1/user/fixture/completed')
        .set('Authorization', `Bearer ${registeredUser.token}`)
        .expect('Content-Type', /json/)
        .expect(200);

      const { payload, message, statusCode, error } = response.body;
      expect(payload).toBeDefined();
      expect(statusCode).toBe(200);
      expect(message).toMatch(/Fixtures found/i);
      expect(error).toBeFalsy();
    });
    it('Should be able to get all PENDING fixtures', async () => {
      const register = await request(app)
        .post('/api/v1/auth/register')
        .send(user2);
      registeredUser = register.body;

      const response = await request(app)
        .get('/api/v1/user/fixture/pending')
        .set('Authorization', `Bearer ${registeredUser.token}`)
        .expect('Content-Type', /json/)
        .expect(200);

      const { payload, message, statusCode, error } = response.body;
      expect(payload).toBeDefined();
      expect(statusCode).toBe(200);
      expect(message).toMatch(/Fixtures found/i);
      expect(error).toBeFalsy();
    });
  });
});
