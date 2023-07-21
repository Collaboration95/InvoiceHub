const ctx = document.getElementById('barchar2');

new Chart(ctx, {
  type: 'line',
  data: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [{
      label: 'Total Amount per Month',
      data: [25000, 12598, 14104, 50394, 40293, 54709, 80274, 15349, 10410, 75243, 142324, 62245],
      borderWidth: 1
    }]
  },
  options: {
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }
});









// const mysql = require('mysql2');
// const { Chart } = require('chart.js');

// // Create a MySQL connection pool
// const pool = mysql.createPool({
//   host: 'localhost',
//   user: 'root',
//   password: 'Ramita0203',
//   database: 'invoicehub',
//   connectionLimit: 10
// });

// // Fetch data from the database
// pool.query('SELECT month, total FROM your_table', (error, results) => {
//   if (error) {
//     console.error('Error fetching data from the database:', error);
//     return;
//   }

//   const labels = results.map((row) => row.month);
//   const values = results.map((row) => row.total);

//   const ctx = document.getElementById('barchar2');
//   new Chart(ctx, {
//     type: 'line',
//     data: {
//       labels: labels,
//       datasets: [{
//         label: 'Total',
//         data: values,
//         borderWidth: 1
//       }]
//     },
//     options: {
//       scales: {
//         y: {
//           beginAtZero: true
//         }
//       }
//     }
//   });

//   // Release the database connection
//   pool.end();
// });

























// const mysql = require('mysql2');
// const { Chart } = require('chart.js');

// // Create a MySQL connection pool
// const pool = mysql.createPool({
//   host: 'localhost',
//   user: 'root',
//   password: 'Ramita0203',
//   database: 'invoicehub',
//   connectionLimit: 10
// });

// // Fetch the data from the database
// pool.query('SELECT MONTH(upload_date) AS month, SUM(total) AS totalSum FROM invoices GROUP BY MONTH(upload_date)', (error, results) => {
//   if (error) {
//     console.error('Error fetching data from the database:', error);
//     return;
//   }

//   const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
//   const data = [];

//   // Iterate over the query results and extract the month and totalSum values
//   for (let i = 0; i < labels.length; i++) {
//     const month = labels[i];
//     let totalSum = 0;

//     // Find the totalSum for the current month in the query results
//     for (const row of results) {
//       const monthNumber = row.month;
//       if (getMonthName(monthNumber) === month) {
//         totalSum = row.totalSum;
//         break;
//       }
//     }

//     data.push(totalSum);
//     console.log('Month:', month); // Log the month name to the console
//     console.log('Total Sum:', totalSum); // Log the total sum to the console
//   }

//   // Create the chart using the retrieved data
//   const ctx = document.getElementById('barchar2');
//   new Chart(ctx, {
//     type: 'line',
//     data: {
//       labels: labels,
//       datasets: [{
//         label: '# of Total',
//         data: data,
//         borderWidth: 1
//       }]
//     },
//     options: {
//       scales: {
//         y: {
//           beginAtZero: true
//         }
//       }
//     }
//   });

//   // Release the database connection
//   pool.end();
// });

// // Helper function to get the month name from the month number (1-12)
// function getMonthName(monthNumber) {
//   const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
//   return months[monthNumber - 1];
// }











// const mysql = require('mysql2');
// const { Chart } = require('chart.js');

// // Create a MySQL connection pool
// const pool = mysql.createPool({
//   host: 'localhost',
//   user: 'root',
//   password: 'Ramita0203',
//   database: 'invoicehub',
//   connectionLimit: 10
// });

// // Fetch the data from the database
// pool.query('SELECT MONTH(upload_date) AS month, SUM(total) AS totalSum FROM invoices GROUP BY MONTH(upload_date)', (error, results) => {
//   if (error) {
//     console.error('Error fetching data from the database:', error);
//     pool.end(); // Release the database connection in case of error
//     return;
//   }

//   const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
//   const data = new Array(12).fill(0); // Initialize data array with zeros

//   // Iterate over the query results and extract the month and totalSum values
//   for (const row of results) {
//     const monthNumber = row.month;
//     const totalSum = row.totalSum;
//     data[monthNumber - 1] = totalSum; // Set the totalSum at the corresponding month index
//   }

//   console.log('Labels:', labels);
//   console.log('Data:', data);

//   // Create the chart using the retrieved data
//   const ctx = document.getElementById('barchar2').getContext('2d');
//   new Chart(ctx, {
//     type: 'line',
//     data: {
//       labels: labels,
//       datasets: [{
//         label: '# of Total',
//         data: data,
//         borderWidth: 1
//       }]
//     },
//     options: {
//       scales: {
//         y: {
//           beginAtZero: true
//         }
//       }
//     }
//   });

//   // Release the database connection
//   pool.end();
// });
