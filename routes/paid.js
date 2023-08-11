//final check by ramita and radhi (11/08)
// paid.js - Router for handling payments
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// Database connection pool (replace with your own database configuration)
const {pool} = require('../server'); // Assuming you have a separate db.js file for database connection

// Configure multer to handle file uploads
const storage = multer.diskStorage({
  destination: path.join(__dirname,'..', 'public', 'Image_payment'), // Using __dirname to get the current directory
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

// Route to upload an image and associate it with the specified invoiceId
router.post('/uploadImage', upload.single('jpeg'), async (req, res) => {
  if (!req.file) {
    res.status(400).send('No image file provided.');
    return;
}
const imagePath =  req.file.filename; // Replace with the folder path
res.status(200).json(imagePath);

});

// Route to insert form data into the "Paid" table
router.post('/form-data', async (req, res) => {
    // Retrieve data from the request body
    const { invoiceId, Company, amount_paid, payment_type, payment_date, payment_image} = req.body;
    // const payment_Image = req.file.path;

    // Insert the record into the table
    const query = `
      INSERT INTO InvoiceHub.Paid (invoiceId, Company, amount_paid, payment_type, payment_date, payment_image)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const values = [invoiceId, Company, amount_paid, payment_type, payment_date, payment_image];
    console.log(invoiceId);
    console.log(Company);
    console.log(amount_paid);
    console.log(payment_type);
    console.log(payment_date);
    console.log(payment_image);


  try {
    const connection = await pool.getConnection();
    await connection.query(query, values);

    res.status(200).json({ message: 'Form data inserted into the Paid table successfully.' });
  } catch (error) {
    console.error('Error inserting form data into the Paid table:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/form-data-soa', async (req, res) => {
  // Retrieve data from the request body
  const { invoiceId, Company, amount_paid, payment_type, payment_date, payment_image, soa } = req.body;

  // Insert the record into the table
  const query = `
    INSERT INTO InvoiceHub.Paid (invoiceId, Company, amount_paid, payment_type, payment_date, payment_image, soa)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [invoiceId, Company, amount_paid, payment_type, payment_date, payment_image, soa];
  console.log(invoiceId);
  console.log(Company);
  console.log(amount_paid);
  console.log(payment_type);
  console.log(payment_date);
  console.log(payment_image);
  console.log(soa);

try {
  const connection = await pool.getConnection();
  await connection.query(query, values);

  res.status(200).json({ message: 'Form data inserted into the Paid table successfully.' });
} catch (error) {
  console.error('Error inserting form data into the Paid table:', error);
  res.status(500).json({ error: 'Internal server error' });
}
});

// Route for retrieving all payment
router.get('/all', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const query = 'SELECT * FROM invoicehub.Paid';
    const [rows] = await connection.query(query);
    connection.release();
    res.json(rows);
  } catch (error) {
    console.error('Error fetching invoices:', error);
    res.status(500).json({ error: 'An error occurred while fetching invoices' });
  }
});

module.exports = router;