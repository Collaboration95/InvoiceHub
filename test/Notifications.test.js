const request = require('supertest');
const express = require('express');
const  app = express(); 
const router = express.Router();
app.use(router);
//test to check if notifications can be displayed
describe('should display notifications', () => {
    it('should show notifications', async () => {
        const response = await request(app).get('/account/all');//retrieve data from database
        expect(response.body).toBe({});//check that the content for notifications from database can be retrieved 
    });
});
//test to check if new notifications cabn be added
describe('Add notification', ()=>{
    if('should sadd notification', async ()=>{
        const response = await request(app);
        expect(dropdownItems.length).toBe(dropdownItems.length++);//checks that adding a notification increases the number of notifications by 1
    });
});
//test to check if dropdown menu can be closed
describe('close dropdown', ()=>{
    it('should close dropdown', async ()=>{
        const response = await request(app);
        var dropdowncontent = document.querySelector('.dropdown-content');
        expect(dropdowncontent.computedStyleMap.display).toBe('none');//check if dropdown can be closed
    });
});
