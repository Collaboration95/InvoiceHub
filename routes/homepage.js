const express = require('express');
const router = express.Router();
const multer = require('multer');
const{pool,table_name}=require ('../server');
const path = require('path');
const crypto = require('crypto');
const { route } = require('./account');


router.get('/fetch-overdue-data', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query(`
    SELECT
    CASE
        WHEN DATEDIFF(NOW(), upload_date) < 30 THEN '<30 days'
        WHEN DATEDIFF(NOW(), upload_date) >= 30 AND DATEDIFF(NOW(), upload_date) < 60 THEN '30-60 days'
        WHEN DATEDIFF(NOW(), upload_date) >= 60 AND DATEDIFF(NOW(), upload_date) < 90 THEN '60-90 days'
        WHEN DATEDIFF(NOW(), upload_date) >= 90 THEN '>90 days'
        ELSE 'More than 90 days'
    END AS category,
    COUNT(*) AS count
FROM forms
WHERE (status = 'Overdue' OR status = 'Unpaid') AND type = 'invoice'
      AND DATEDIFF(NOW(), upload_date) > 30
GROUP BY category
ORDER BY
    CASE category
        WHEN '<30 days' THEN 1
        WHEN '30-60 days' THEN 2
        WHEN '60-90 days' THEN 3
        WHEN '>90 days' THEN 4
        ELSE 5
    END;

    `); 

    connection.release();

    const categories = [];
    const counts = [];

    for (const data of rows) {
      categories.push(data.category); // Corrected from month.push(data.month);
      counts.push(data.count); // Corrected from amount.push(data.total);
    }

    const chartData = {
      labels: categories,
      datasets: [
        {
          label: 'Amount Overdue',
          data: counts,
          backgroundColor: [
            'rgba(255, 0, 0, 0.6)',
            'rgba(192, 0, 0, 0.6)',
            'rgba(130, 0, 0, 0.6)',
            'rgba(81, 9, 9, 0.6)'
          ],
          borderColor: [
            'rgba(255, 0, 0, 0.6)',
            'rgba(192, 0, 0, 0.6)',
            'rgba(130, 0, 0, 0.6)',
            'rgba(81, 9, 9, 0.6)'
          ],
          borderWidth: 1,
        },
      ],
    };
    res.json(chartData);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'An error occurred while fetching invoices' });
  }
});

router.get('/fetch-expense-data', async (req, res) => {
  try {
    const connection = await pool.getConnection();

    const [rows] = await connection.query(`
    SELECT *
    FROM (
      SELECT
        DATE_FORMAT(upload_date, '%b') AS month,
        SUM(total) AS total
      FROM forms
      WHERE type = 'invoice'
      GROUP BY DATE_FORMAT(upload_date, '%b')
    ) AS subquery
    ORDER BY 
      CASE month
        WHEN 'Jan' THEN 1
        WHEN 'Feb' THEN 2
        WHEN 'Mar' THEN 3
        WHEN 'Apr' THEN 4
        WHEN 'May' THEN 5
        WHEN 'Jun' THEN 6
        WHEN 'Jul' THEN 7
        WHEN 'Aug' THEN 8
        WHEN 'Sep' THEN 9
        WHEN 'Oct' THEN 10
        WHEN 'Nov' THEN 11
        WHEN 'Dec' THEN 12
        ELSE 99
      END;
    `);

    const month = [];
    const amount = [];

    for (const data of rows) {
      month.push(data.month);
      amount.push(data.total);
    }

    const chartData = {
      labels: month,
      datasets: [
        {
          label: 'Total Expense Per Month',
          data: amount,
          backgroundColor: 'rgba(54, 162, 235, 0.2)', 
          borderColor: 'rgba(54, 162, 235, 1)', 
          borderWidth: 1,
        },
      ],
    };
    res.json(chartData);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



router.get('/fetch-total-outstanding', async (req, res) => {
    try {
      const connection = await pool.getConnection();
  
      const [rows] = await connection.execute(`
        SELECT SUM(total) AS total_outstanding
        FROM forms
        WHERE type = 'invoice' AND status = 'unpaid';
      `);
  
      connection.release();
  
      const totalOutstanding = Number(rows[0].total_outstanding); 
      const formattedTotal = totalOutstanding.toFixed(2);
  
      res.send(formattedTotal);
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  


  router.get('/fetch-total-due', async (req, res) => {
    try {
        const connection = await pool.getConnection();

        const [rows] = await connection.execute(`
            SELECT SUM(total) AS total_due
            FROM forms
            WHERE type = 'invoice' AND status = 'unpaid'
                  AND DATE_FORMAT(upload_date, '%Y-%m') = DATE_FORMAT(CURRENT_DATE, '%Y-%m');
        `);

        connection.release();

        const totalDue = Number(rows[0].total_due);
        const formattedTotal = totalDue.toFixed(2); 

        res.send(formattedTotal);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});




  router.get('/fetch-total-overdue', async (req, res) => {
    try {
        const connection = await pool.getConnection();

        const [rows] = await connection.execute(`
            SELECT SUM(total) AS total_overdue
            FROM forms
            WHERE type = 'invoice' AND status IN ('Unpaid', 'Overdue')
                  AND DATEDIFF(CURRENT_DATE, upload_date) > 30;
        `);

        connection.release();

        const totalOverdue = Number(rows[0].total_overdue); 
        const formattedTotal = totalOverdue.toFixed(2);

        res.send(formattedTotal);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});










module.exports = router;
