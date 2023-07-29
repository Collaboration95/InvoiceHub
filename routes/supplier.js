const express = require('express');
const router = express.Router();
const { pool } = require('../server');

// Route for retrieving all invoices
router.get('/all', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const query = 'SELECT DISTINCT company_name, contact_number, address, email FROM suppliersdb.supplier';
    const [rows] = await connection.query(query);
    connection.release();
    res.json(rows);
  } catch (error) {
    console.error('Error fetching invoices:', error);
    res.status(500).json({ error: 'An error occurred while fetching invoices' });
  }
});

// // Route for updating invoice status
// router.put('/update-status', async (req, res) => {
//   const { status, invoiceId } = req.body;

//   try {
//     const connection = await pool.getConnection();
//     const query = 'UPDATE invoicehub.Sample_invoices SET status = ? WHERE Invoice_id = ?';
//     const [result] = await connection.query(query, [status, invoiceId]);

//     if (result.affectedRows > 0) {
//       res.status(200).json({ message: 'Status updated successfully' });
//     } else {
//       res.status(404).json({ error: 'Invoice not found' });
//     }

//     connection.release();
//   } catch (error) {
//     console.error('Error updating status:', error);
//     res.status(500).json({ error: 'An error occurred while updating status' });
//   }
// });

module.exports = router;
