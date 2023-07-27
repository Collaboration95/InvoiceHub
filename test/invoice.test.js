// invoiceRoutes.test.js
const request = require('supertest');
const express = require('express');
const { pool } = require('../server'); // Replace '../server' with the correct path to your server file
const invoiceRouter = require('../routes/invoice'); // Replace './invoice' with the correct path to your invoice.js file

// Create an instance of Express app and use the invoiceRouter middleware
const app = express();
app.use('/invoice', invoiceRouter);

// Mock the pool.getConnection method
jest.mock('../server', () => {
  return {
    pool: {
      getConnection: async () => Promise.resolve(),
    },
  };
});

describe('GET /dummy', () => {
  test('should respond with "Dummy output"', done => {
    request(app)
      .get('/invoice/dummy')
      .expect('Content-Type', /json/)
      .expect(200)
      .expect('"Dummy output"') // Make sure to use double quotes around the string response
      .end(done);
  });
});