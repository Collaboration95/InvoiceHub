const mysql = require('mysql2/promise');

const mysqlConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
};

async function fetchData() {
  try {
    const connection = await mysql.createConnection(mysqlConfig);

    const [rows] = await connection.execute(`
    SELECT
    CASE
      WHEN DATEDIFF(NOW(), upload_date) < 30 THEN '<30 days'
      WHEN DATEDIFF(NOW(), upload_date) >= 30 AND DATEDIFF(NOW(), upload_date) < 60 THEN '30-60 days'
      WHEN DATEDIFF(NOW(), upload_date) >= 60 AND DATEDIFF(NOW(), upload_date) < 90 THEN '60-90 days'
      WHEN DATEDIFF(NOW(), upload_date) >= 90 THEN '>90 days'
      ELSE 'More than 90 days'
    END AS category,
    COUNT(*) AS count
    FROM invoices
    WHERE status = 'Overdue'
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
  
  

    connection.end();

    const categories = [];
    const counts = [];

    for (const data of rows) {
      categories.push(data.category);
      counts.push(data.count);
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

    return chartData;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}

module.exports = fetchData;
