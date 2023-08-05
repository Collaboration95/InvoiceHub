const express = require('express');
const { pool, table_name } = require('../server');

const router = express.Router();

router.get('/fetch-overdue-data', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    
    const dueInAWeekQuery = `
      SELECT *
      FROM ${table_name.invoice}
      WHERE status = 'Unpaid' AND DATEDIFF(NOW(), upload_date) = 23;
    `;
    
    const dueIn3DaysQuery = `
      SELECT *
      FROM ${table_name.invoice}
      WHERE status = 'Unpaid' AND DATEDIFF(NOW(), upload_date) = 27;
    `;

    const overdueQuery = `
      SELECT *
      FROM ${table_name.invoice}
      WHERE status = 'Overdue' AND DATEDIFF(NOW(), upload_date) >= 30;
    `;

    const [dueInAWeekRows] = await connection.query(dueInAWeekQuery);
    const [dueIn3DaysRows] = await connection.query(dueIn3DaysQuery);
    const [overdueRows] = await connection.query(overdueQuery);

    connection.release();

    res.json({
      dueInAWeek: dueInAWeekRows,
      dueIn3Days: dueIn3DaysRows,
      overdue: overdueRows,
    });
  } catch (error) {
    console.error('Error fetching overdue data:', error);
    res.status(500).json({ error: 'An error occurred while fetching overdue data' });
  }
});

module.exports = router;
