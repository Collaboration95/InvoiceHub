const express = require('express');
const { pool, table_name } = require('../server');
const { route } = require('./account'); 
const router = express.Router();

router.get('/fetch-1-days-data', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    console.log('no issues here');
    
    const dueInAWeekQuery = `
      SELECT *
      FROM ${table_name.invoice}
      WHERE status = 'Unpaid' AND type = 'invoice' AND DATEDIFF(NOW(), upload_date) = 29;
    `; 
    const [dueInAWeekRows] = await connection.query(dueInAWeekQuery);
    connection.release();
    res.json(dueInAWeekRows);
  } catch (error) {
    console.error('Error fetching overdue data:', error);
    res.status(500).json({ error: 'An error occurred while fetching overdue data' });
  }
});
router.get('/fetch-2-days-data', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    console.log('no issues here');
    
    const dueInAWeekQuery = `
      SELECT *
      FROM ${table_name.invoice}
      WHERE status = 'Unpaid' AND type = 'invoice' AND DATEDIFF(NOW(), upload_date) = 28;
    `; 
    const [dueInAWeekRows] = await connection.query(dueInAWeekQuery);
    connection.release();
    res.json(dueInAWeekRows);
  } catch (error) {
    console.error('Error fetching overdue data:', error);
    res.status(500).json({ error: 'An error occurred while fetching overdue data' });
  }
});

router.get('/fetch-3-days-data', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    console.log('no issues here');
       
    const dueIn3DaysQuery = `
      SELECT *
      FROM ${table_name.invoice}
      WHERE status = 'Unpaid' AND type = 'invoice' AND DATEDIFF(NOW(), upload_date) = 27;
    `;
    const [dueIn3DaysRows] = await connection.query(dueIn3DaysQuery);
    connection.release();

    res.json(dueIn3DaysRows);
  } catch (error) {
    console.error('Error fetching overdue data:', error);
    res.status(500).json({ error: 'An error occurred while fetching overdue data' });
  }
});

router.get('/fetch-overdue-data', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    console.log('no issues here');

    const overdueQuery = `
      SELECT *
      FROM ${table_name.invoice}
      WHERE status = 'Unpaid' AND type = 'invoice' AND DATEDIFF(NOW(), upload_date) >= 30;
    `;

    const [overdueRows] = await connection.query(overdueQuery);
    connection.release();

    res.json(overdueRows);
  } catch (error) {
    console.error('Error fetching overdue data:', error);
    res.status(500).json({ error: 'An error occurred while fetching overdue data' });
  }
});

router.get('/fetch-overdue-data-soa', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    console.log('no issues here');

    const overdueQuery = `
      SELECT *
      FROM ${table_name.invoice}
      WHERE status = 'Unpaid' AND type = 'soa' AND DATEDIFF(NOW(), upload_date) >= 30;
    `;

    const [overdueRows] = await connection.query(overdueQuery);
    connection.release();

    res.json(overdueRows);
  } catch (error) {
    console.error('Error fetching overdue data:', error);
    res.status(500).json({ error: 'An error occurred while fetching overdue data' });
  }
});

module.exports = router;