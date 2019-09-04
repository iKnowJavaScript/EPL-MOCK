const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../index');
const User = require('../api/models/User.model');
let { user1, user2, fakeUser } = require('./dummy_data').users;

let user;

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
  describe('Testing the post route', () => {
    it('Should be able to add new user', async () => {
      const response = await request(app)
        .post('/api/v1/user')
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
        .post('/api/v1/user')
        .send(fakeUser)
        .expect(200);
      const { statusCode, message, errors } = response.body;
      expect(statusCode).toBe(400);
      expect(message).toMatch(/invalid fields/i);
      expect(errors).toBeDefined;
    });
    it('Should not be able to add user with thesame email address', async () => {
      const response = await request(app)
        .post('/api/v1/user')
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
  describe("Testing Get request")
});
