import request from 'supertest';
import express from 'express';

const app = express();

app.get('/hello', (req, res) => {
  res.status(200).send('hello world');
});

describe('GET /hello', () => {
  it('should return hello world', async () => {
    const res = await request(app).get('/hello');
    expect(res.status).toBe(200);
    expect(res.text).toBe('hello world');
  });
});
