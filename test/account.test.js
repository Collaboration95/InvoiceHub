// Final checked by Ramita and Radhi (11/08)

const request = require('supertest');
const express = require('express');
const accountRouter = require('../routes/account');
const{pool,table_name}=require('../server')

const app = express();
app.use(express.json()); // Parse request body as JSON
app.use('/account', accountRouter);

describe('testing login route', () => {
  it('should handle the /login POST endpoint', async () => {
    const response = await request(app)
      .post('/account/login')
      .send({ username: 'test12', password: '3200' });
    expect(response.status).toBe(200);
    expect(response.body).toEqual( [{"Email": "projecttestmail05@gmail.com", "id": 65, "mode": "admin", "password": "3200", "user": "test12"}]);
  });

  it('it should handle invalid users ', async () => {
    const response = await request(app)
      .post('/account/login')
      .send({ username: 'invalid', password: '3200' });

    expect(response.status).toBe(404);
    expect(response.body).toEqual([]);
  });
});

describe('Elevate Privilege Routes', () => {
  it('should return exists: true for an existing user', async () => {
    const response = await request(app)
      .post('/account/elevate-privilege')
      .send({ user: 'test12' });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ exists: true });
  });
  it('should return error for invalid user', async () => {
    const response = await request(app)
      .post('/account/elevate-privilege')
      .send({ user: 'invalidUser' });
    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: 'Internal Server Error' });
  });
});

describe('check-requests', () => {
  it('should return response for existing user', async () => {
    const response = await request(app)
      .get('/account/check-requests')
    expect(response.status).toBe(200);
  });

});

describe('Elevate Privilege Routes', () => {
  it('should return exists: true for an existing user', async () => {
    const response = await request(app)
      .post('/account/elevate-privilege')
      .send({ user: 'test12' });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ exists: true });
  });
  it('should return error for invalid user', async () => {
    const response = await request(app)
      .post('/account/elevate-privilege')
      .send({ user: 'invalidUser' });
    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: 'Internal Server Error' });
  });
});

describe('clear privilege', () => {

  it('should return user not found ', async () => {
    const response = await request(app)
      .delete('/account/clear-privilege')
      .send({ user: 'invalid user' });
    expect(response.status).toBe(404);
    expect(response.body).toEqual({error:'User not found'});
  });

});


describe('Signup Endpoint', () => {
  it('should sign up a new user', async () => {
    const random= Math.floor(Math.random() * 90000) + 10000;
    const newUser = {
      name: 'John Doe'+random,
      password: 'securepassword',
      email: 'john.doe@example.com',
      userType: 'guest',
    };

    const response = await request(app).post('/account/signup').send(newUser);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Signup successful' });
  });

  it('should return 409 for duplicate entry', async () => {
    // Assuming a duplicate user already exists in the database
    const duplicateUser = {
      name: 'Duplicate User',
      password: 'duplicatepassword',
      email: 'duplicate.user@example.com',
      userType: 'guest',
    };

    const response = await request(app).post('/account/signup').send(duplicateUser);

    expect(response.status).toBe(409);
    expect(response.body).toEqual({ error: 'Duplicate entry', field: 'user' });
  });

});


afterAll(async () => {
  try {
    await pool?.end(); // Close the pool if it exists
  } catch (error) {
    console.error('Error closing MySQL connection pool:', error);
  }
});
