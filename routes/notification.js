const express = require('express');
const router = express.Router();
const multer = require('multer');
const{pool,table_name}=require ('../server');

router.get('/get-unpaid-invoices-30', async (req, res) => {
    try {
      const connection = await pool.getConnection();
      
      // Calculate 23 days ago 
      const threeWeeksAgo = new Date();
      threeWeeksAgo.setDate(threeWeeksAgo.getDate() - 30);
  
      // Format the date in MySQL-compatible format (YYYY-MM-DD)
      const formattedDate = threeWeeksAgo.toISOString().split('T')[0];
  
      // Query to fetch unpaid invoices that have been unpaid for 3 weeks
      const query = `
        SELECT * FROM ${table_name.invoice}
        WHERE status = 'Unpaid' AND upload_date >= ?
      `;
      
      const [rows] = await connection.query(query, [formattedDate]);
      connection.release();
      
      res.json(rows);
    } catch (error) {
      console.error('Error fetching unpaid invoices:', error);
      res.status(500).json({ error: 'An error occurred while fetching unpaid invoices' });
    }
  });

router.get('/get-unpaid-invoices-7', async (req, res) => {
    try {
      const connection = await pool.getConnection();
      
      // Calculate 23 days ago 
      const threeWeeksAgo = new Date();
      threeWeeksAgo.setDate(threeWeeksAgo.getDate() - 23);
  
      // Format the date in MySQL-compatible format (YYYY-MM-DD)
      const formattedDate = threeWeeksAgo.toISOString().split('T')[0];
  
      // Query to fetch unpaid invoices that have been unpaid for 3 weeks
      const query = `
        SELECT * FROM ${table_name.invoice}
        WHERE status = 'Unpaid' AND upload_date = ?
      `;
      
      const [rows] = await connection.query(query, [formattedDate]);
      connection.release();
      
      res.json(rows);
    } catch (error) {
      console.error('Error fetching unpaid invoices:', error);
      res.status(500).json({ error: 'An error occurred while fetching unpaid invoices' });
    }
  });

  router.get('/get-unpaid-invoices-3', async (req, res) => {
    try {
      const connection = await pool.getConnection();
      
      // Calculate 27 days ago
      const threeWeeksAgo = new Date();
      threeWeeksAgo.setDate(threeWeeksAgo.getDate() - 27);
  
      // Format the date in MySQL-compatible format (YYYY-MM-DD)
      const formattedDate = threeWeeksAgo.toISOString().split('T')[0];
  
      // Query to fetch unpaid invoices that have been unpaid for 3 weeks
      const query = `
        SELECT * FROM ${table_name.invoice}
        WHERE status = 'Unpaid' AND upload_date = ?
      `;
      
      const [rows] = await connection.query(query, [formattedDate]);
      connection.release();
      
      res.json(rows);
    } catch (error) {
      console.error('Error fetching unpaid invoices:', error);
      res.status(500).json({ error: 'An error occurred while fetching unpaid invoices' });
    }
  });
module.exports = router;


