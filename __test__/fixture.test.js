const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../index');
const User = require('../api/models/User.model');
const Team = require('../api/models/Team.model');
const Fixture = require('../api/models/Fixture.mode');
let { user1, admin } = require('./dummy_data').users;
let { team1, team2 } = require('./dummy_data').teams;
let { makeFixture } = require('./dummy_data');

let registeredAdmin;
let registeredUser;
let teamOne;
let teamTwo;
let randomFixture;

beforeAll(async () => {
  const addAdmin = await request(app)
    .post('/api/v1/auth/register')
    .send(admin);
  registeredAdmin = addAdmin.body;

  const AddUser = await request(app)
    .post('/api/v1/auth/register')
    .send(user1);
  registeredUser = AddUser.body;

  let addTeam = await request(app)
    .post('/api/v1/team')
    .set('Authorization', `Bearer ${registeredAdmin.token}`)
    .send(team1);
  teamOne = addTeam.body.payload;

  addTeam = await request(app)
    .post('/api/v1/team')
    .set('Authorization', `Bearer ${registeredAdmin.token}`)
    .send(team2);
  teamTwo = addTeam.body.payload;

  const data = makeFixture(teamOne, teamTwo);
  const createFIxture = await request(app)
    .post('/api/v1/fixture')
    .set('Authorization', `Bearer ${registeredAdmin.token}`)
    .send(data);
  randomFixture = createFIxture.body.payload;
});

afterAll(async () => {
  await User.deleteMany().exec();
  await Team.deleteMany().exec();
  await Fixture.deleteMany().exec();

  mongoose.connection.close();
});

describe('Testing Team Route', () => {
  describe('Teasting The "POST" route, Adding Fixture', () => {
    it('Ordinary User should not be able to add fixture', async () => {
      const data = makeFixture(teamTwo, teamOne);

      const response = await request(app)
        .post('/api/v1/fixture')
        .set('Authorization', `Bearer ${registeredUser.token}`)
        .send(data)
        .expect(200);
      const { statusCode, message, payload } = response.body;
      expect(statusCode).toBe(401);
      expect(message).toMatch(/Unauthorized/i);
      expect(payload).toBeFalsy();
    });
    it('Admin should be able to add new Fixtures', async () => {
      const data = makeFixture(teamTwo, teamOne);

      const response = await request(app)
        .post('/api/v1/fixture')
        .set('Authorization', `Bearer ${registeredAdmin.token}`)
        .send(data)
        .expect(200);
      const { statusCode, message, payload, error } = response.body;
      expect(statusCode).toBe(200);
      expect(message).toMatch(/Fixture successfully added/i);
      expect(payload).toMatchObject({
        date: expect.any(String),
        time: expect.any(String),
        home_team: expect.any(String),
        away_team: expect.any(String),
        status: expect.any(String)
      });
      expect(error).toBeFalsy();
    });
  });
  describe('Testing "GET" request to fixture route', () => {
    it('User should be able get a all fixture from the database', async () => {
      const response = await request(app)
        .get('/api/v1/fixture')
        .set('Authorization', `Bearer ${registeredUser.token}`)
        .expect(200);
      const { statusCode, message, payload, error } = response.body;
      expect(statusCode).toBe(200);
      expect(message).toMatch(/Success/i);
      expect(payload).toBeDefined();
      expect(error).toBeFalsy();
    });
    it('User should be able get a a single fixture from the database', async () => {
      const response = await request(app)
        .get(`/api/v1/fixture/${randomFixture._id}`)
        .set('Authorization', `Bearer ${registeredUser.token}`)
        .expect(200);
      const { statusCode, message, payload, error } = response.body;
      expect(statusCode).toBe(200);
      expect(message).toMatch(/Success/i);
      expect(payload).toMatchObject({
        date: expect.any(String),
        time: expect.any(String),
        home_team: expect.any(Object),
        away_team: expect.any(Object),
        status: expect.any(String)
      });
      expect(error).toBeFalsy();
    });
  });
  describe('Admin should be able to edit  and delete "PUT" fixtures', () => {
    it('User should not be able to perform any PUT operation on fixture', async () => {
      const response = await request(app)
        .put(`/api/v1/fixture/${randomFixture._id}`)
        .set('Authorization', `Bearer ${registeredUser.token}`)
        .send({ stadium: 'Wembley' })
        .expect(200);
      const { statusCode, message, payload } = response.body;
      expect(statusCode).toBe(401);
      expect(message).toMatch(/Unauthorized/i);
      expect(payload).toBeFalsy();
    });
    it('Admin should be able to EDIT a Fixture', async () => {
      const response = await request(app)
        .put(`/api/v1/fixture/${randomFixture._id}`)
        .set('Authorization', `Bearer ${registeredAdmin.token}`)
        .send({ stadium: 'Wembley Stadium' })
        .expect(200);
      const { statusCode, message, payload, error } = response.body;
      expect(statusCode).toBe(200);
      expect(message).toMatch(/Succes/i);
      expect(payload).toMatchObject({
        date: expect.any(String),
        time: expect.any(String),
        home_team: expect.any(Object),
        away_team: expect.any(Object),
        status: expect.any(String),
        stadium: expect.any(String)
      });
      expect(error).toBeFalsy();
    });
    it('Admin should be able to DELETE a Fixture', async () => {
      const response = await request(app)
        .put(`/api/v1/fixture/${randomFixture._id}/delete`)
        .set('Authorization', `Bearer ${registeredAdmin.token}`)
        .send({ isDeleted: true })
        .expect(200);
      const { statusCode, message, payload } = response.body;
      expect(statusCode).toBe(200);
      expect(message).toMatch(/Succes/i);
      expect(payload).toBeFalsy();
    });
  });
});
