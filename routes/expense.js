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
    month,
    SUM(total) as total
FROM invoices
GROUP BY month
ORDER BY CASE 
    WHEN month = 'Jan' THEN 1
    WHEN month = 'Feb' THEN 2
    WHEN month = 'Mar' THEN 3
    WHEN month = 'Apr' THEN 4
    WHEN month = 'May' THEN 5
    WHEN month = 'Jun' THEN 6
    WHEN month = 'Jul' THEN 7
    WHEN month = 'Aug' THEN 8
    WHEN month = 'Sep' THEN 9
    WHEN month = 'Oct' THEN 10
    WHEN month = 'Nov' THEN 11
    WHEN month = 'Dec' THEN 12
    ELSE 99
END;

    `);

    connection.end();

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
          backgroundColor: 'rgba(54, 162, 235, 0.2)', // Set a single color value for all data points
          borderColor: 'rgba(54, 162, 235, 1)', // Set the same color value with alpha 1 for border
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
