const request = require('supertest');
const express = require('express');
const accountRouter = require('../routes/account');

//const express = require('express');
//const accountRouter = require('../routes/account');

// Create an instance of Express app and register the accountRouter
//const app = express();
//app.use('/account', accountRouter); 
const app = express();
app.use(express.json()); // Parse request body as JSON
app.use('/account', accountRouter)

describe('testing account', () => {
  it('should handle the /login POST endpoint', async () => {
    const response = await request(app)
      .post('/account/login')
      .send({ username: 'test', password: '3200' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({id: 49, username: 'test'});
  });

  it('should handle the /elevate-privilege POST endpoint', async () => {
    const response = await request(app)
      .post('/elevate-privilege')
      .send({ user: 'exampleuser' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({user:'exampleuser' });
  });

  it('should handle the /check-requests GET endpoint', async () => {
    const response = await request(app).get('/check-requests');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([
    { id: 49, user: 'test' },
  ]);
  });

  it('should handle the /check-privilege GET endpoint', async () => {
    const user = 'exampleuser';
    const response = await request(app).get(`/check-privilege?user=${user}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      { id: 1, user: 'exampleuser', flag: 0 }
    ]);
  });

  it('should handle the /clear-privilege DELETE endpoint', async () => {
    const user = 'exampleuser';
    const response = await request(app).delete(`/clear-privilege?user=${user}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({message : 'Privilege cleared successfully'});
  });

  it('should handle the /signup POST endpoint', async () => {
    const response = await request(app)
      .post('/signup')
      .send({ name: 'John', password: 'password', email: 'john@example.com', userType: 'guest' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Signup successful' });
  });

  it('should handle the /check-account POST endpoint', async () => {
    const response = await request(app)
      .post('/check-account')
      .send({ user: 'exampleuser' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ exists: true });
  });

  it('should handle the /respond-request POST endpoint', async () => {
    const response = await request(app)
      .post('/respond-request')
      .send({ user: 'exampleuser', action: 'accept' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ success: true });
  });
});
