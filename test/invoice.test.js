const request = require('supertest');
const express = require('express');
const invoiceRouter = require('../routes/invoice');
//const app = express();

// Include the invoice router
//const invoiceRouter = require('./routes/invoice');

// Mount the invoice router on the app
//app.use('/invoice/',invoiceRouter);
const app = express();
app.use(express.json()); // Parse request body as JSON
app.use('/invoice/',invoiceRouter)


describe('Testing the Invoice.test', () => {
    it('should save the image and return the file path', async () => {
        const response = await request(app)
          .post('/invoice/save-image')
          .attach('jpeg', 'C:\Users\mahim\OneDrive - Singapore University of Technology and Design\TERM 5\elements of Software construction\Project\photo_2023-07-13_13-37-13.jpg');
          //change the path above to the path of the image in your computer
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('imagePath');
      });

    //need to check cause i am not able to see the database
    it('should insert a record into the invoice table', async () => {
      const response = await request(app)
        .post('/invoice/insert-record')
        .send({
          user: 'test',
          invoiceid: '12345',
          invoice_name: '	Sample Invoice',
          upload_date: '19/07/2023',
          status: 'pending',
          path: '../public/img-db/1689739111494-51828fca6ca8db85-1_page-0001.jpg'
        });
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'Signup successful' });
    });

    it('should save the detected text for an invoice', async () => {
      const response = await request(app)
        .post('/invoice/save-detected-text')
        .send({ invoiceid: '12345', detectedText: 'month' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'Detected text saved successfully' });
    });

    it('should get the detected text for an invoice', async () => {
      const response = await request(app).get('/invoice/get-detected-text/12345');

      expect(response.status).toBe(200);
      expect(response.text).toBe('month');
    });

    it('should fetch all invoices', async () => {
      const response = await request(app).get('/invoice/all');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(expect.any(Array));
    });
});
