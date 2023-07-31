const express = require('express');
const router = express.Router();
const multer = require('multer');
const{pool,table_name}=require ('../server');
const crypto = require('crypto');
const { route } = require('./account');

// Function to generate a unique filename
function generateUniqueFilename(originalFilename) {
  const timestamp = Date.now();
  const randomString = crypto.randomBytes(8).toString('hex');
  const filename = `${timestamp}-${randomString}-${originalFilename}`;
  return filename;
}

// Configure multer middleware to handle file uploads
const storage = multer.diskStorage({
  destination: "/Users/speedpowermac/Documents/projects/CODE_MAIN/Term5/InvoiceHub/public/img-db", 
  filename: (req, file, cb) => {
    cb(null,generateUniqueFilename(file.originalname));
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
    const { user, soa_number, company_name, upload_date, status, path, total } = req.body;
  
    // Insert the record into the table
    const query = `INSERT INTO ${table_name.soa} (users, soa_number, company_name, upload_date, status, total) VALUES (?, ?, ?, ?, ?, ?)`;
    const values = [user, soa_number, company_name, upload_date, status, path, total];
    
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

router.post('/save-detected-text', async (req, res) => {
    const { soa_number, detectedText } = req.body;
    const query = `UPDATE soa SET detectedText = ? WHERE soa_number = ?`;
    try {
      const connection = await pool.getConnection();
      const results = await connection.query(query, [detectedText, soa_number]);
  
      console.log('Detected text saved successfully!');
      res.status(200).json({ message: 'Detected text saved successfully' });
  
      connection.release();
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: 'An error occurred while saving detected text' });
    }
});

router.get('/get-detected-text/:soa_number', async (req, res) => {
    const soa_number = req.params.soa_number;
  
    const query = `SELECT detectedText FROM soa WHERE soa_number = ?`;
    try {
      const connection = await pool.getConnection();
      const [rows] = await connection.query(query, [soa_number]);
      
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
      const [rows] = await connection.query(`SELECT users, soa_number, company_name, upload_date, total, status FROM ${table_name.soa}`);
      connection.release();
      res.json(rows);
    } catch (error) {
      console.error('Error fetching soa:', error);
      res.status(500).json({ error: 'An error occurred while fetching soa' });
    }
});

router.delete('/soa_number', async (req, res) => {
  const {soa_number} = req.body;

  try {
    const connection = await pool.getConnection();
    const query = 'DELETE FROM invoicehub.soa WHERE soa_number = ?'
    const [result] = await connection.query(query, [soa_number]);

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
    console.error('Error fetching soa:', error);
    res.status(500).json({ error: 'An error occurred while fetching soa' });
  }
});

module.exports = router;

