
const request = require('supertest');
const express = require('express');
const supplierRouter = require('../routes/supplier');
const{pool,table_name}=require('../server');

const app = express();
app.use(express.json()); // Parse request body as JSON
app.use('/supplier', supplierRouter);

describe('testing the get(/all) route', () => {
  it('should release data to the front-end ', async () => {
    const response = await request(app)
    .get('/account/all')
    expect(response.body).toEqual({});
  });
});

describe('testing the .post(/form-data) route', () => {
  it('should post all data through the form-data route', async () => {
    const response = await request(app)
    .post('/account/form-data')
    .send({contact_number:'11223344',
            Address: 'testAddress',
            Email: 'test@gmail.com' ,
            company_name: 'testcompany'
    });
    expect(response.body).toEqual({});
  });
});

// const request = require('supertest');
// const express = require('express');

// const app = express();
// const router = require('../routes/supplier'); // Replace 'your_route_file' with the actual file path containing your route.

// app.use('/', router);

// describe('GET /all', () => {
//   it('should return all supplier information', async () => {
//     // Mock the database connection and query function
//     const fakeQuery = [
//       {
//         Name: 'Hanwell Holdings Ltd',
//         Address: 'TIPEXPTE.LTDA Subsidiary of Hanwell Holdings Ltd348 Jalan Boon Lay619529 Singapore Singapore',
//         Telephone: '62687600',
//         Email: 'Hanwell@gmail.com'
//       },
//       {
//         Name: 'CROWN PACIFIC BEVERAGE PTE. LTD.',
//         Address: '26 Tuas Avenue 12, Singapore 639042',
//         Telephone: '6861 1111',
//         Email: 'orderCPMeiji@chiatai.com.sg'
//       },
//     ]

//     const mockExecute = jest.fn().mockResolvedValue([fakeQuery]);
//     const mockConnection = {
//       execute: mockExecute,
//       end: jest.fn(),
//     };
//     jest.spyOn(require('mysql2/promise'), 'createConnection').mockResolvedValue(mockConnection);

//     // expect(mockExecute).toHaveBeenCalled();
//     // expect(mockConnection.end).toHaveBeenCalled();
  
//     // Assert the response
//     expect(res.body).toEqual([
//       {
//         Name: 'Hanwell Holdings Ltd',
//         Address: 'TIPEXPTE.LTDA Subsidiary of Hanwell Holdings Ltd348 Jalan Boon Lay619529 Singapore Singapore',
//         Telephone: '62687600',
//         Email: 'Hanwell@gmail.com'
//       },
//       {
//         Name: 'CROWN PACIFIC BEVERAGE PTE. LTD.',
//         Address: '26 Tuas Avenue 12, Singapore 639042',
//         Telephone: '6861 1111',
//         Email: 'orderCPMeiji@chiatai.com.sg'
//       },
//     ]);
//   });
// });
