const request = require('supertest');
const app = require('../app');
const { User } = require('../models');

describe('Auth Endpoints', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      });
    
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.username).toEqual('testuser');
  });

  it('should not register with existing username', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser2',
        email: 'test2@example.com',
        password: 'password123'
      });

    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser2',
        email: 'test3@example.com',
        password: 'password123'
      });
    
    expect(res.statusCode).toEqual(409);
  });

  it('should login with valid credentials', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser4',
        email: 'test4@example.com',
        password: 'password123'
      });

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'testuser4',
        password: 'password123'
      });
    
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should not login with wrong password', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser5',
        email: 'test5@example.com',
        password: 'password123'
      });

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'testuser5',
        password: 'wrongpassword'
      });
    
    expect(res.statusCode).toEqual(401);
  });
});
