const request = require('supertest');
const app = require('./api.test');

describe('Profile Routes', () => {
  it('should require authentication for /profile', async () => {
    const res = await request(app).get('/profile');
    expect(res.statusCode).toBe(401);
  });
});
