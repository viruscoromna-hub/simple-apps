const request = require('supertest');
require('dotenv').config();

const connection = require('../middleware/db_connect');
const app = require('../app');

describe('UI routes', () => {
  it('serves the static landing page', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toContain('<title>IDN DevOps Simple Apps</title>');
  });

  it('responds on /app1', async () => {
    const response = await request(app).get('/app1');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Hello this Apps 1!' });
  });

  it('responds on /app2', async () => {
    const response = await request(app).get('/app2');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Hello this App 2!' });
  });
});

describe('API status metadata', () => {
  it('returns service status', async () => {
    const response = await request(app).get('/status');
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      status: 'ok',
      version: app.releaseInfo.version,
    });
    expect(typeof response.body.uptime).toBe('number');
    expect(typeof response.body.timestamp).toBe('number');
  });

  it('exposes release information', async () => {
    const response = await request(app).get('/meta');
    expect(response.status).toBe(200);
    expect(response.body).toEqual(app.releaseInfo);
  });
});

describe('Users endpoint & error handling', () => {
  afterAll(() => {
    connection.end();
  });

  it('falls back when the database is unreachable', async () => {
    const response = await request(app).get('/users');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThanOrEqual(1);
    expect(response.body[0]).toHaveProperty('name');
  });

  it('returns 404 for unknown endpoints', async () => {
    const response = await request(app).get('/tidak-ada');
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: 'Resource not found' });
  });

  it('propagates errors through the handler', async () => {
    const response = await request(app).get('/__error');
    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: 'Internal server error' });
  });
});

