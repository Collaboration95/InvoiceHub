//final check by ramita and radhi (11/08)
const express = require('express');
const router = express.Router();
const multer = require('multer');
const{pool,table_name}=require ('../server');
const path = require('path');
const crypto = require('crypto');
const { route } = require('./account'); 


function generateUniqueFilename(originalFilename) {
  const timestamp = Date.now();
  var oroginalFilename= originalFilename.toLowerCase();
  const randomString = crypto.randomBytes(8).toString('hex');
  const filename = `${timestamp}-${randomString}-${originalFilename}`;
  return filename;
}
console.log
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
    const { user, invoiceid, invoice_name, upload_date, status, path, total,type } = req.body;
    // Insert the record into the table
    const query = `INSERT INTO ${table_name.invoice} (users, invoiceid, invoice_name, upload_date, status, path, total , type) VALUES (?, ?, ?, ?, ?, ?, ?,?)`;
    const values = [user, invoiceid, invoice_name, upload_date, status, path, total,type];
    
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
  try{
  const updatedInvoiceid = invoiceid.toString();
  const total = JSON.parse(detectedText).extractedDetails.Total[0];
  const name = JSON.parse(detectedText).extractedDetails.Name[0];
  const issuedDate= JSON.parse(detectedText).extractedDetails.IssuedDate[0];  
  const detectedId = JSON.parse(detectedText).extractedDetails.Id[0];
  console.log(JSON.parse(detectedText).extractedDetails);
  } catch(error){
console.error("Error:", error);
  res.status(403);
  }
try {
  const updatedInvoiceid = invoiceid.toString();
  const total = JSON.parse(detectedText).extractedDetails.Total[0];
  const name = JSON.parse(detectedText).extractedDetails.Name[0];
  const issuedDate= JSON.parse(detectedText).extractedDetails.IssuedDate[0];  
  const detectedId = JSON.parse(detectedText).extractedDetails.Id[0];
  const connection = await pool.getConnection();
  const query = `UPDATE ${table_name.invoice} SET detectedText = ?, total = ?,invoice_name=? ,upload_date=?,invoiceid=? WHERE invoiceid = ?`;
  const results = await connection.query(query, [detectedText, total, name,issuedDate,detectedId,updatedInvoiceid]);
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
  
    const query = `SELECT detectedText FROM ${table_name.invoice} WHERE invoiceid = ?`;
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
  
router.get('/get-all-invoices', async (req, res) => {
    try {
      const connection = await pool.getConnection();
      const [rows] = await connection.query(`SELECT * FROM ${table_name.invoice} WHERE type='invoice'`);
      connection.release();
      res.json(rows);
    } catch (error) {
      console.error('Error fetching invoices:', error);
      res.status(500).json({ error: 'An error occurred while fetching invoices' });
    }
});

router.get('/all-soa', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const query = `SELECT * FROM InvoiceHub.forms WHERE type='soa';`
    const [rows] = await connection.query(query);
    connection.release();
    res.json(rows);
  } catch (error) {
    console.error('Error fetching invoices:', error);
    res.status(500).json({ error: 'An error occurred while fetching invoices' });
  }
});

router.get('/get-all-soa-invoice', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query(`SELECT * FROM ${table_name.invoice} `);
    connection.release();
    res.json(rows);
  } catch (error) {
    console.error('Error fetching invoices:', error);
    res.status(500).json({ error: 'An error occurred while fetching invoices' });
  }
});


router.get('/dummy', async (req, res) => {
  try {
    res.json("Dummy output");
  } catch (error) {
    console.error('Error fetching invoices:', error);
    res.status(500).json({ error: 'An error occurred while fetching invoices' });
  }
});

router.get('/img-db/:imageName', async (req, res) => {
  const imageName = req.params.imageName;
  const imageUrl = `http://127.0.0.1:8080/img-db/${imageName}`;

  try {
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const contentType = response.headers['content-type'];
    res.set('Content-Type', contentType);
    res.send(response.data);
  } catch (error) {
    // Handle the 404 error here
    res.status(404).send('Image not found');
  }
});
router.get('/fetch-overdue-data', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query(`
    SELECT
    CASE
      WHEN DATEDIFF(NOW(), upload_date) < 30 THEN '<30 days'
      WHEN DATEDIFF(NOW(), upload_date) >= 30 AND DATEDIFF(NOW(), upload_date) < 60 THEN '30-60 days'
      WHEN DATEDIFF(NOW(), upload_date) >= 60 AND DATEDIFF(NOW(), upload_date) < 90 THEN '60-90 days'
      ELSE 'More than 90 days'
    END AS category,
    COUNT(*) AS count
    FROM ${table_name.invoice}
    WHERE status = 'Overdue'
    GROUP BY category;
    `); 

    connection.release();

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
    res.json(chartData);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'An error occurred while fetching invoices' });
  }
});

router.get('/fetch-expense-data', async (req, res) => {
  try {
    const connection = await pool.getConnection();

    const [rows] = await connection.query(`
    SELECT *
FROM (
  SELECT
    DATE_FORMAT(upload_date, '%b') AS month,
    SUM(total) AS total
  FROM ${table_name.invoice}
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
    res.json(chartData);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;


router.post('/update_data', async (req, res) => {
  const { invoice_name, upload_date, total, invoiceid } = req.body;

  try {
    const connection = await pool.getConnection();
    const query = `UPDATE ${table_name.invoice} SET invoice_name = ?, upload_date = ?, total = ? WHERE invoiceid = ?`;
    const [result] = await connection.query(query, [invoice_name, upload_date, total, invoiceid]);

    if (result.affectedRows > 0) {
      res.status(200).json({ message: "Updated successfully" });
    } else {
      res.status(404).json({ error: "Invoice not found" });
    }
    connection.release();
  } catch (error) {
    console.error('ERROR', error);
    res.status(500).json({ error: "An error occurred" });
  }
});

router.post('/update_data_soa', async (req, res) => {
  const {invoice_name, upload_date, total, invoiceid, soa_invoice, path } = req.body;

  try {
    const connection = await pool.getConnection();
    const query = `UPDATE ${table_name.invoice} SET invoice_name = ?, upload_date = ?, total = ?, invoiceid =?, soa_invoice = ? WHERE path = ?`;
    const [result] = await connection.query(query, [invoice_name, upload_date, total, invoiceid, soa_invoice, path]);

    if (result.affectedRows > 0) {
      res.status(200).json({ message: "Updated successfully" });
    } else {
      res.status(404).json({ error: "Invoice not found" });
    }
    connection.release();
  } catch (error) {
    console.error('ERROR', error);
    res.status(500).json({ error: "An error occurred" });
  }
});

router.delete('/invoiceid', async (req, res) => {
  const {invoiceid} = req.body;

  try {
    const connection = await pool.getConnection();
    const query = `DELETE FROM ${table_name.invoice} WHERE invoiceid = ?`
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
  }
  
});


