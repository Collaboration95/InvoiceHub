const express = require('express');
const router = express.Router();
const { pool,table_name} = require('../server');


// Route for retrieving all invoices
router.get('/all', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const query = 'SELECT * FROM invoicehub.Sample_invoices';
    const [rows] = await connection.query(query);
    connection.release();
    res.json(rows);
  } catch (error) {
    console.error('Error fetching invoices:', error);
    res.status(500).json({ error: 'An error occurred while fetching invoices' });
  }
});

// Route for updating invoice status
router.put('/update-status', async (req, res) => {
  const { status, invoiceId } = req.body;

  try {
    const connection = await pool.getConnection();
    const query = 'UPDATE InvoiceHub.forms SET status = ? WHERE invoiceid = ?';
    const [result] = await connection.query(query, [status, invoiceId]);

    if (result.affectedRows > 0) {
      res.status(200).json({ message: 'Status updated successfully' });
    } else {
      res.status(404).json({ error: 'Invoice not found' });
    }

    connection.release();
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ error: 'An error occurred while updating status' });
  }
});

// Route for updating invoice status
router.put('/update-soa-status', async (req, res) => {
  const { status, soa_number } = req.body;

  try {
    const connection = await pool.getConnection();
    const query = 'UPDATE invoicehub.forms SET status = ? WHERE invoiceid = ?';
    const [result] = await connection.query(query, [status, soa_number]);

    if (result.affectedRows > 0) {
      res.status(200).json({ message: 'Status updated successfully' });
    } else {
      res.status(404).json({ error: 'Invoice not found' });
    }

    connection.release();
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ error: 'An error occurred while updating status' });
  }
});

module.exports = router;