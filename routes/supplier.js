//final checked by ramita and radhi (11/08)
const express = require('express');
const router = express.Router();
const { pool } = require('../server');

// Route for retrieving all supplier information
router.get('/all', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const query = `SELECT DISTINCT 
    invoice_name,
    JSON_UNQUOTE(JSON_EXTRACT(CONVERT(detectedText USING utf8), '$.extractedDetails.Address[0]')) AS Address,
    JSON_UNQUOTE(JSON_EXTRACT(CONVERT(detectedText USING utf8), '$.extractedDetails.Telephone[0]')) AS Telephone,
    JSON_UNQUOTE(JSON_EXTRACT(CONVERT(detectedText USING utf8), '$.extractedDetails.email[0]')) AS Email
    FROM 
    forms;`
    const [rows] = await connection.query(query);
    connection.release(); 
    res.json(rows);
  } catch (error) {
    console.error('Error fetching invoices:', error);
    res.status(500).json({ error: 'An error occurred while fetching invoices' });
  }

});

router.post('/form-data', async (req, res) => {
  // Retrieve data from the request body
  const { company_name,contact_number,Address, Email} = req.body; //req body is coming from the website 
  const query = `UPDATE forms
  SET detectedText = JSON_SET(
      CONVERT(detectedText USING utf8mb4),
      '$.extractedDetails.Telephone[0]', ?,
      '$.extractedDetails.Address[0]', ?,
      '$.extractedDetails.email[0]', ?
  )
  WHERE invoice_name = ?`;
  const values = [contact_number, Address, Email,company_name];
try {
  const connection = await pool.getConnection();
  await connection.query(query, values);

  res.status(200).json({ message: 'Supplier changes have been updated successfully' });
} catch (error) {
  console.error('Error inserting editted data into the supplier table:', error);
  res.status(500).json({ error: 'Internal server error' });
}
});

// Route for updating supplier information
router.put('/update-supplier', async (req, res) => {
  const { contact_number,Email,Address,company_name } = req.body;

  try {
    const connection = await pool.getConnection();
    const query =`UPDATE forms
      SET detectedText = JSON_SET(
          CONVERT(detectedText USING utf8mb4),
          '$.extractedDetails.Telephone[0]', ?,
          '$.extractedDetails.Address[0]', ?,
          '$.extractedDetails.email[0]', ?
      )
      WHERE JSON_UNQUOTE(JSON_EXTRACT(CONVERT(detectedText USING utf8mb4), '$.extractedDetails.Name[0]')) = ?`;
    const [result] = await connection.query(query, [contact_number, Address, Email,company_name]);

    if (result.affectedRows > 0) {
      res.status(200).json({ message: 'Supplier updated successfully' });
    } else {
      res.status(404).json({ error: 'company name not found' });
    }

    connection.release();
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ error: 'An error occurred while updating status' });
  }
});



module.exports = router;
