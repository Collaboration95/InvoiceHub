const express = require('express');
const router = express.Router();
const multer = require('multer');
const{pool,table_name}=require ('../server');
const path = require('path');
const crypto = require('crypto');
const { route } = require('./account');

// Function to generate a unique filename
function generateUniqueFilename(originalFilename) {
  const timestamp = Date.now();
  const randomString = crypto.randomBytes(8).toString('hex');
  const filename = `${timestamp}-${randomString}-${originalFilename}`;
  return filename;
}

const storage = multer.diskStorage({
  destination: path.join(__dirname,'..', 'public', 'img-db'), // Using __dirname to get the current directory
  filename: (req, file, cb) => {
    cb(null, generateUniqueFilename(file.originalname));
  }
});

const upload = multer({ storage });

// POST endpoint to save the image
router.post('/save-image', upload.single('jpeg'), (req, res) => {
    if (!req.file) {
        res.status(400).send('No image file provided.');
        return;
    }
    const imagePath =  req.file.filename; // Replace with the folder path
    res.status(200).json(imagePath);
});

router.post('/insert-record', async (req, res) => {
    const { user, invoiceid, invoice_name, upload_date, status, path, total } = req.body;
  
    // Insert the record into the table
    const query = `INSERT INTO ${table_name.invoice} (users, invoiceid, invoice_name, upload_date, status, path, total) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const values = [user, invoiceid, invoice_name, upload_date, status, path, total];
    
    try {
      const connection = await pool.getConnection();
      
      const results = await connection.query(query,values);
      res.status(200).json({ message: 'Signup successful' });
      connection.release();
    } catch (error) {
      console.error("Error:", error);
      if (error.code === 'ER_DUP_ENTRY') {
        res.status(409).json({ error: 'Duplicate entry', field: 'user' });
      } else {
        res.status(500).json({ error: 'An error occurred during signup' });
      }
    }
});

router.post('/save-detected-data', async (req, res) => {
  const { invoiceid, detectedText } = req.body;
  const total = JSON.parse(detectedText).extractedDetails.Total[0];
  console.log(total);
  const query = `UPDATE invoices SET detectedText = ?, total = ? WHERE invoiceid = ?`;
  try {
    const connection = await pool.getConnection();
    const results = await connection.query(query, [detectedText, total, invoiceid]);

    console.log('Detected text and total updated successfully!');
    res.status(200).json({ message: 'Detected text and total updated successfully' });

    connection.release();
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred while saving detected text and total' });
  }
});


router.get('/get-detected-text/:invoiceid', async (req, res) => {
    const invoiceId = req.params.invoiceid;
  
    const query = `SELECT detectedText FROM invoices WHERE invoiceid = ?`;
    try {
      const connection = await pool.getConnection();
      const [rows] = await connection.query(query, [invoiceId]);
      
      if (rows.length > 0) {
        const detectedTexts = rows.map(row => row.detectedText);
        res.status(200).send(detectedTexts.join('\n')); // Send the detected texts as plain text
      } else {
        console.log('No detected texts found');
        res.status(404).json({ message: 'No detected texts found' });
      }
      connection.release();
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: 'An error occurred while retrieving detected text' });
    }
});
  
router.get('/table', async (req, res) => {
    try {
      const connection = await pool.getConnection();
      const [rows] = await connection.query(`SELECT users, invoiceid, invoice_name, path , upload_date , total, status FROM ${table_name.invoice}`);
      connection.release();
      res.json(rows);
    } catch (error) {
      console.error('Error fetching invoices:', error);
      res.status(500).json({ error: 'An error occurred while fetching invoices' });
    }
});

router.delete('/invoiceid', async (req, res) => {
  const {invoiceid} = req.body;

  try {
    const connection = await pool.getConnection();
    const query = 'DELETE FROM invoicehub.invoices WHERE invoiceid = ?'
    const [result] = await connection.query(query, [invoiceid]);

    if (result.affectRows > 0) {
      res.status (200).json({mesage: "deleted"});
    } else {
      res.status(404).json({error: "ERROR"});
    }
    connection.release();
  } catch (error) {
    console.error('ERROR', error);
    res.status(500).json({error: "an error"});
  }});
 
router.get('/dummy', async (req, res) => {
  try {
    res.json("Dummy output");
  } catch (error) {
    console.error('Error fetching invoices:', error);
    res.status(500).json({ error: 'An error occurred while fetching invoices' });
  }
});

module.exports = router;

