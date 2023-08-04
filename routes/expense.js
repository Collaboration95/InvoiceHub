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
