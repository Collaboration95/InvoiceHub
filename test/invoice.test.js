// invoiceRoutes.test.js
const request = require('supertest');
const express = require('express');
const { pool } = require('../server'); // Replace '../server' with the correct path to your server file
const invoiceRouter = require('../routes/invoice'); // Replace './invoice' with the correct path to your invoice.js file

// const app = express();
// app.use('/invoice', invoiceRouter);

// // Mock the pool.getConnection method
// jest.mock('../server', () => {
//   return {
//     pool: {
//       getConnection: async () => Promise.resolve(),
//     },
//   };
// });

// describe('GET /dummy', () => {
//   test('should respond with "Dummy output"', done => {
//     request(app)
//       .get('/invoice/dummy')
//       .expect('Content-Type', /json/)
//       .expect(200)
//       .expect('"Dummy output"') // Make sure to use double quotes around the string response
//       .end(done);
//   });
// });
// const request = require('supertest');
// const express = require('express');
const { router, generateUniqueFilename } = require('../routes/invoice'); // Replace 'your-js-file' with the actual file path.

const  app = express(); 
app.use(router);

describe('Dummy function', () => {
  it('should return "Dummy output" when accessing /dummy', async () => {
    const response = await request(app).get('/dummy');
    expect(response.status).toBe(200);
    expect(response.body).toBe('Dummy output');
  });

});

