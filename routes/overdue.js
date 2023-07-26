const mysql = require('mysql2/promise');

const mysqlConfig = {
  host: 'localhost',
  user: 'root',
  password: 'Ramita0203',
  database: 'invoicehub',
  socketPath: '/tmp/mysql.sock'
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
        ELSE 'More than 90 days'
      END AS category,
      COUNT(*) AS count
      FROM invoices
      WHERE status = 'Overdue'
      GROUP BY category;
    `);

    connection.end();

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
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
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
