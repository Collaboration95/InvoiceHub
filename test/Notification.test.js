const request = require('supertest');
const express = require('express');
const { describe } = require('node:test');
const  app = express(); 
const router = express.Router();


app.use(router);

describe('should display notifications', () => {
    it('should show notifications', async () => {
        const response = await request(app).get('/account/all');//retrieve data from database
        expect(response.body).toStrictEqual({});//check that the content for notifications from database can be retrieved 
    });
});

describe('add notification', ()=>{
    it('should add notification', async ()=>{
        const response = await request(app).get('/account/all');
        const script = require('../public/js/notif-new');
        const sample_data = [
            { users: 'test12', id: '1016', name: 'Floppy Pte Ltd', date: 'June 15, 2023', amount: '3617.15', status: 'PAID', action: '' },
        ];
        const updated = add_overdue(sample_data);
        expect(response.body).toStrictEqual({});//check if dropdown can be closed
    });
});

describe('close dropdown', ()=>{
    it('should close dropdown', async ()=>{
        const response = await request(app).get('/account/all');
        //var dropdowncontent = document.querySelector('.dropdown-content');
        expect(response.body).toStrictEqual(!{});//should fail
    });
});
