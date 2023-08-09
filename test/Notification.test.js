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

describe('Add notification', ()=>{
    if('should sadd notification', async ()=>{
        const response = await request(app);
        var dropdowncontent = document.querySelector('.dropdown-content');
        expect(dropdownItems.length).toBe(dropdownItems.length++);//checks that adding a notification increases the number of notifications by 1
    });
});
