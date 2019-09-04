const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../index');
const User = require('../api/models/User.model');
const Team = require('../api/models/Team.model');
let { user1, admin } = require('./dummy_data').users;
let { team1, team2 } = require('./dummy_data').teams;

let registeredAdmin;
let registeredUser;
let randomRequest;

beforeAll(async () => {
  const adAdmin = await request(app)
    .post('/api/v1/auth/register')
    .send(admin);
  registeredAdmin = adAdmin.body;

  const AddUser = await request(app)
    .post('/api/v1/auth/register')
    .send(user1);
  registeredUser = AddUser.body;

  const addTeam = await request(app)
    .post('/api/v1/team')
    .set('Authorization', `Bearer ${registeredAdmin.token}`)
    .send(team1);
  randomRequest = addTeam.body.payload;
});

afterAll(async () => {
  await User.deleteMany().exec();
  await Team.deleteMany().exec();
  mongoose.connection.close();
});

describe('Testing Team Route', () => {
  describe('Teasting The "POST" route, Adding teams', () => {
    it('Ordinary User should not be able to add teams', async () => {
      const response = await request(app)
        .post('/api/v1/team')
        .set('Authorization', `Bearer ${registeredUser.token}`)
        .send(user1)
        .expect(200);
      const { statusCode, message, payload } = response.body;
      expect(statusCode).toBe(401);
      expect(message).toMatch(/Unauthorized/i);
      expect(payload).toBeFalsy();
    });
    it('Admin should be able to add new Teams', async () => {
      const response = await request(app)
        .post('/api/v1/team')
        .set('Authorization', `Bearer ${registeredAdmin.token}`)
        .send(team2)
        .expect(200);
      const { statusCode, message, payload, error } = response.body;
      expect(statusCode).toBe(200);
      expect(message).toMatch(/Team successfully added/i);
      expect(payload).toBeDefined();
      expect(error).toBeFalsy();
    });
  });
  describe('Testing "GET" request to team route', () => {
    it('User should be able get a all teams from the database', async () => {
      const response = await request(app)
        .get('/api/v1/team')
        .set('Authorization', `Bearer ${registeredUser.token}`)
        .expect(200);
      const { statusCode, message, payload, error } = response.body;
      expect(statusCode).toBe(200);
      expect(message).toMatch(/Success/i);
      expect(payload).toBeDefined();
      expect(error).toBeFalsy();
    });
    it('User should be able get a a single team from the database', async () => {
      const response = await request(app)
        .get(`/api/v1/team/${randomRequest._id}`)
        .set('Authorization', `Bearer ${registeredUser.token}`)
        .expect(200);
      const { statusCode, message, payload, error } = response.body;
      expect(statusCode).toBe(200);
      expect(message).toMatch(/Success/i);
      expect(payload).toBeDefined();
      expect(error).toBeFalsy();
    });
  });
  describe('Admin should be able to edit  and delete "PUT" team', () => {
    it('User should not be able to perform any PUT operation on team', async () => {
      const response = await request(app)
        .put(`/api/v1/team/${randomRequest._id}`)
        .set('Authorization', `Bearer ${registeredUser.token}`)
        .send({ name: 'Chelsea FC' })
        .expect(200);
      const { statusCode, message, payload, error } = response.body;
      expect(statusCode).toBe(401);
      expect(message).toMatch(/Unauthorized/i);
      expect(payload).toBeFalsy();
    });
    it('Admin should be able to EDIT a Team', async () => {
      const response = await request(app)
        .put(`/api/v1/team/${randomRequest._id}`)
        .set('Authorization', `Bearer ${registeredAdmin.token}`)
        .send({ name: 'Arsenal FC' })
        .expect(200);
      const { statusCode, message, payload, error } = response.body;
      expect(statusCode).toBe(200);
      expect(message).toMatch(/Succes/i);
      expect(payload).toMatchObject({
        name: expect.any(String),
        coach: expect.any(String),
        stadium: expect.any(String),
        founded: expect.any(String)
      });
      expect(error).toBeFalsy();
    });
    it('Admin should be able to DELETE a Team', async () => {
      const response = await request(app)
        .put(`/api/v1/team/${randomRequest._id}/delete`)
        .set('Authorization', `Bearer ${registeredAdmin.token}`)
        .send({ isDeleted: true })
        .expect(200);
      const { statusCode, message, payload, error } = response.body;
      expect(statusCode).toBe(200);
      expect(message).toMatch(/Succes/i);
      expect(payload).toBeFalsy();
    });
  });
});

// user signature = const {payload, token} = registeredAdmin;
