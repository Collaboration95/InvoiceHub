
const request = require('supertest');
const express = require('express');
const supplierRouter = require('../routes/supplier');
const{pool,table_name}=require('../server');


const app = express();
app.use(express.json()); // Parse request body as JSON
app.use('/supplier', supplierRouter);

describe('testing the get(/all) route', () => {
  it('should obtain the data in the database ', async () => {
    const response = await request(app)
    .get('/supplier/all');
    //the output is sensitive to what the database has 
    output = [
      {
        Name: 'Hanwell Holdings Ltd',
        Address: 'TIPEXPTE.LTDA Subsidiary of Hanwell Holdings Ltd348 Jalan Boon Lay619529 Singapore Singapore',
        Telephone: '62687600',
        Email: 'Hanwell@gmail.com'
      },
      {
        Name: 'CROWN PACIFIC BEVERAGE PTE. LTD.',
        Address: '26 Tuas Avenue 12, Singapore 639042',
        Telephone: '6861 1010',
        Email: 'orderCPMeiji@chiatai.com.sg'
      },
      {
        Name: 'LEE FOOD MANUFACTORY PTE LTD',
        Address: 'WOODLANDS LOOP #02-46/#02-47, WOODLANDS EAST INDUSTRIAL ESTATE, SINGAPORE 738322',
        Telephone: '6449 284011223344',
        Email: 'yshone@singnet.com.sg'
      }
    ];
    expect(response.status).toBe(200);
    expect(response.body).toEqual(output);
    
    //expect(response.body).toEqual({});
  });
});

describe('testing the .post(/form-data) route', () => {
  it('should post all data through the form-data route', async () => {
    const response = await request(app)
    .post('/supplier/form-data');
  
    expect(response.status).toBe(200);
    expect(response.body).toEqual({"message": "Supplier changes have been updated successfully"});
  
  });
});

afterAll(async () => {
  try {
    await pool?.end(); // Close the pool if it exists
  } catch (error) {
    console.error('Error closing MySQL connection pool:', error);
  }
});