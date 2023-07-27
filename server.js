const express = require('express');
const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config();
const bodyParser = require('body-parser');
const app = express();
const table_name ={ login:"users" ,delete_flag:"account_flag",images:"Images",handle_privilege:"account_elev",invoice:"invoices"};

const fetchExpenseData = require('./routes/expense'); 
const fetchOverdueData = require('./routes/overdue'); 

// API endpoint for expenses
app.get('/expense', async (req, res) => {
  try {
    const data = await fetchExpenseData();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// API endpoint for overdue
app.get('/overdue', async (req, res) => {
  try {
    const data = await fetchOverdueData();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


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

app.use(express.static(path.join(__dirname, 'public')));



app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static('public'));

module.exports = {pool,table_name};  // All the datastructures that need to be exported

const accountRouter = require('./routes/account'); // setup routes for each file under routes/
app.use('/account',accountRouter);

const awsRouter = require('./routes/rekognition');
app.use('/rekognition/',awsRouter);

const invoiceRouter = require('./routes/invoice');
app.use('/invoice/',invoiceRouter)

app.get('*', function(req, res){ // Catch 404 errors 
  res.status(404).sendFile(path.join(__dirname,'public','html','404.html'));
});

const port =process.env.port;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

