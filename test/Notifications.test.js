const request = require('supertest');
const express = require('express');
const { pool } = require('../server');

const  app = express(); 
app.use(router);

describe('should display notifications', ()=>{
  it('should show notifications', ()=>{
    const datda = await request(app).get('./dummy');
    expect(document.getElementById("span").toBe("10 minutes ago");
  });
}
