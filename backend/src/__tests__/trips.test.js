const request = require('supertest');
const app = require('../app');
const { Destination } = require('../models');

let token;
let destId;

beforeEach(async () => {
  const authRes = await request(app)
    .post('/api/auth/register')
    .send({
      username: 'triptester',
      email: 'trip@example.com',
      password: 'password123'
    });
  token = authRes.body.token;

  const dest = await Destination.create({
    name: 'Trip Dest',
    country: 'Trip Country'
  });
  destId = dest._id;
});

describe('Trip Endpoints', () => {
  it('should reject unauthenticated requests', async () => {
    const res = await request(app).get('/api/trips');
    expect(res.statusCode).toEqual(401);
  });

  it('should create a trip', async () => {
    const res = await request(app)
      .post('/api/trips')
      .set('Authorization', `Bearer ${token}`)
      .send({
        destinationId: destId,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 86400000).toISOString(),
        budget: 1000
      });
    
    expect(res.statusCode).toEqual(201);
    expect(res.body.budget).toEqual(1000);
  });

  it('should get user trips', async () => {
    await request(app)
      .post('/api/trips')
      .set('Authorization', `Bearer ${token}`)
      .send({
        destinationId: destId,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 86400000).toISOString()
      });

    const res = await request(app)
      .get('/api/trips')
      .set('Authorization', `Bearer ${token}`);
    
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toEqual(1);
  });
});
