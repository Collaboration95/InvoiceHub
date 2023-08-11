const {retrieveData_overdue} = require('../InvoiceHub-main/public/js/notif-new');
const request = require('supertest');
const express = require('express');
const { describe } = require('node:test');
const app = express();
const router = express.Router();
app.use(router);

jest.mock('', () => {
    return {
        getData: jest.fn(() => {
            try {
                const sample_data = [
                    { id: '12345', amount: '123.45', status: 'OVERDUE' }
                ];

                sample_data.forEach((invoice) => {
                    invoice.statusColor = 'rgb(252, 183, 137)';
                });
                return sample_data;
            } catch (error) {
                console.error("Error fetching notifications data: ", error);
            }
        })
    }

});
describe("RetrieveData", ()=>{
    it('should retrieve data from database', async()=>{
        
        const outcome = retrieveData_overdue();
        expect(outcome);
    })
})
