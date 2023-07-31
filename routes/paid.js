// paid.js - Router for handling payments

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// Database connection pool (replace with your own database configuration)
const {pool} = require('../server'); // Assuming you have a separate db.js file for database connection

// Configure multer to handle file uploads
const storage = multer.diskStorage({
  destination: './public/uploads/', // Change this path to where you want to store uploaded images
  filename: function (req, file, cb) {
    // Generate a unique filename to avoid conflicts
    const uniquePrefix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniquePrefix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Route to upload an image and associate it with the specified invoiceId
router.post('/uploadImage', upload.single('image'), async (req, res) => {
  try {

    // Retrieve the image data as a buffer from the request
    const imageBuffer = req.body;

    // Insert the record into the table
    const query = `
      SELECT LAST_INSERT_ID() AS last_id;
      UPDATE InvoiceHub.Paid
      SET payment_Image = "helps"
      WHERE payment_Number = last_id;
    `;
    const values = [imageBuffer];

    const connection = await pool.getConnection();
    await connection.query(query, values);

    res.status(200).json({ message: 'Image uploaded successfully and associated with the specified invoiceId.' });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'An error occurred while uploading the image' });
  }
});

// Route to insert form data into the "Paid" table
router.post('/form-data', async (req, res) => {
    // Retrieve data from the request body
    const { invoiceId, Company, amount_paid, payment_type, payment_date} = req.body;
    // const payment_Image = req.file.path;

    // Insert the record into the table
    const query = `
      INSERT INTO InvoiceHub.Paid (invoiceId, Company, amount_paid, payment_type, payment_date)
      VALUES (?, ?, ?, ?, ?)
    `;
    const values = [invoiceId, Company, amount_paid, payment_type, payment_date];
    console.log(invoiceId);
    console.log(Company);
    console.log(amount_paid);
    console.log(payment_type);
    console.log(payment_date);
    //console.log(payment_Image);


  try {
    const connection = await pool.getConnection();
    await connection.query(query, values);

    res.status(200).json({ message: 'Form data inserted into the Paid table successfully.' });
  } catch (error) {
    console.error('Error inserting form data into the Paid table:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;