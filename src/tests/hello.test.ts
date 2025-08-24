import request from 'supertest';
import express from 'express';

const app = express();

app.get('/hello', (req, res) => {
  res.status(200).send('hello world');
});

describe('GET /hello', () => {
  //? describe is a jest function that groups related tests
  //* grouping test realted to endpoint /hello
  it('should return hello world', async () => {
    //? it is a jest function that defines a single test case
    const res = await request(app).get('/hello'); //? request use a superset to simulate a real http request to express app
    expect(res.status).toBe(200);
    expect(res.text).toBe('hello world'); //? sends GET /hello request to the express app / asserts the request /
  });
});
 