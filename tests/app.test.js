const request = require('supertest');
const { app, server } = require('../src/app');

describe('Tests de base', () => {
  afterAll((done) => {
    server.close(done);
  });

  test('GET / devrait retourner un message', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.body.message).toBeDefined();
  });

  test('GET /api/health devrait retourner healthy', async () => {
    const response = await request(app).get('/api/health');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('healthy');
  });
});