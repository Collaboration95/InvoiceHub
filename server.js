const express = require('express');
const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config();
const bodyParser = require('body-parser');
const app = express();
const table_name = {
  login: "users",
  delete_flag: "account_flag",
  images: "Images",
  handle_privilege: "account_elev",
  invoice: "invoices",
};

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

pool.on('error', (err) => {
  console.error('Error in MySQL connection pool:', err);
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static('public'));

// Export the pool and table_name for testing purposes
module.exports = { pool, table_name };

// Check if this file is run directly (as the main application)
if (require.main === module) {
  // Set up routes and start the server
  const accountRouter = require('./routes/account');
  app.use('/account', accountRouter);

  const awsRouter = require('./routes/rekognition');
  app.use('/rekognition/', awsRouter);

  const invoiceRouter = require('./routes/invoice');
  app.use('/invoice/', invoiceRouter);

  app.get('*', function (req, res) { // Catch 404 errors 
    res.status(404).sendFile(path.join(__dirname, 'public', 'html', '404.html'));
  });

  const port = process.env.PORT ;
  
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

