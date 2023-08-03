// invoiceRoutes.test.js
const request = require('supertest');
const express = require('express');
const { pool } = require('../server'); // Replace '../server' with the correct path to your server file
const invoiceRouter = require('../routes/invoice'); // Replace './invoice' with the correct path to your invoice.js file

// Create an instance of Express app and use the invoiceRouter middleware
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


const { generateUniqueFilename } = require('../routes/invoice'); // Replace 'your-js-file' with the actual file path.

// Mock Date.now() to always return a fixed value
jest.spyOn(global.Date, 'now').mockImplementation(() => 1629999999000); // Replace 1629999999000 with your desired timestamp

// Mock crypto.randomBytes() to always return a fixed value
jest.mock('crypto', () => ({
  randomBytes: jest.fn(() => Buffer.from('12345678')),
}));

describe('generateUniqueFilename', () => {
  it('should generate a unique filename with timestamp and random string', () => {
    // Test Case 1
    const originalFilename = 'document.pdf';
    const generatedFilename = generateUniqueFilename(originalFilename);
    expect(generatedFilename).toMatch(/^\d{13}-[a-fA-F0-9]{16}-document\.pdf$/);
  });

  it('should handle filenames with special characters', () => {
    // Test Case 2
    const originalFilename = 'my_resume@2023.docx';
    const generatedFilename = generateUniqueFilename(originalFilename);
    expect(generatedFilename).toMatch(/^\d{13}-[a-fA-F0-9]{16}-my_resume@2023\.docx$/);
  });
});




