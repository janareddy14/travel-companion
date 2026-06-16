const request = require('supertest');
const app = require('../app');
const { Destination } = require('../models');

describe('Destination Endpoints', () => {
  beforeEach(async () => {
    await Destination.create([
      { name: 'Test Dest 1', country: 'Test Country 1', description: 'Desc 1' },
      { name: 'Test Dest 2', country: 'Test Country 2', description: 'Desc 2' }
    ]);
  });

  it('should get all destinations', async () => {
    const res = await request(app).get('/api/destinations');
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toEqual(2);
  });

  it('should get destination by ID', async () => {
    const dest = await Destination.findOne({ name: 'Test Dest 1' });
    const res = await request(app).get(`/api/destinations/${dest._id}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.name).toEqual('Test Dest 1');
  });

  it('should search destinations', async () => {
    const res = await request(app).get('/api/destinations/search?query=Dest 2');
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toEqual(1);
    expect(res.body[0].name).toEqual('Test Dest 2');
  });
});
