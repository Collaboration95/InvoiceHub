const request = require('supertest');
const express = require('express');
const notificationRouter = require('../routes/notification');
const{pool,table_name}=require('../server');

// backend
const app = express();
app.use(express.json()); // Parse request body as JSON
app.use('/notification', notificationRouter);

describe('testing the fetch-1-days-data route', () => {
  it('should obtain the data in the database ', async () => {
    const response = await request(app)
    .get('/notification/fetch-1-days-data');
    //the output is sensitive to what the database has 
    output = [];
    //expect(response.status).toBe(200);
    expect(response.body).toEqual(output);
    
    //expect(response.body).toEqual({});
  });
});

describe('testing the fetch-2-days-data route', () => {
    it('should obtain the data in the database ', async () => {
      const response = await request(app)
      .get('/notification/fetch-2-days-data');
      //the output is sensitive to what the database has 
      output = [];
      expect(response.status).toBe(200);
      expect(response.body).toEqual(output);
      
      //expect(response.body).toEqual({});
    });
  });

  describe('testing the fetch-3-days-data route', () => {
    it('should obtain the data in the database ', async () => {
      const response = await request(app)
      .get('/notification/fetch-3-days-data');
      //the output is sensitive to what the database has 
      output = [ ];
      expect(response.status).toBe(200);
      expect(response.body).toEqual(output);
      
      //expect(response.body).toEqual({});
    });
  });

  describe('testing the fetch-overdue-data route', () => {
    it('should obtain the data in the database ', async () => {
      const response = await request(app)
      .get('/notification/fetch-overdue-data');
      //the output is sensitive to what the database has 
      output = [
        {
          invoiceid:'8157048692' ,
          invoice_name: 'TPA Holdings Ltd',
          upload_date: '2020-06-18T16:00:00.000Z',
          status:'Overdue',
          total:'104.03',
        },
    ];
      expect(response.status).toBe(200);
      expect(response.body).toEqual(output);
      
      //expect(response.body).toEqual({});
    });
  });

  describe('testing the fetch-overdue-data-soa route', () => {
    it('should obtain the data in the database ', async () => {
      const response = await request(app)
      .get('/notification/fetch-overdue-data-soa');
      //the output is sensitive to what the database has 
      output = [];
      expect(response.status).toBe(200);
      expect(response.body).toEqual(output);
      
      //expect(response.body).toEqual({});
    });
  });

  afterAll(async () => {
    try {
      await pool?.end(); // Close the pool if it exists
    } catch (error) {
      console.error('Error closing MySQL connection pool:', error);
    }
  });

  