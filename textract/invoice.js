const ocrPackage = require('./textractUtils.js');
const mysql = require('mysql2/promise'); 
const config = require('../../config.js');

// Configure AWS credentials and region
process.env.AWS_ACCESS_KEY_ID = config.awsAccesskeyID;
process.env.AWS_SECRET_ACCESS_KEY = config.awsSecretAccessKey;
process.env.AWS_REGION = config.awsRegion;

// perform OCR on invoices and extract data
async function OCRandDataExtraction(filepath, dict1, dict2) {  //OCRandDataExtraction 
    try {
      // Perform OCR and get the analysis result
      const ocrData = await ocrPackage.getTextractAnalysis(filepath);
  
      // Extract forms and tables from the scanned result using "ocrPackage" functions
      const formsData = ocrPackage.extractForms(ocrData, dict1);
      const tablesData = ocrPackage.extractTables(ocrData, dict2);
      // Combine the extracted data if need
      const combinedData = Object.assign({},formsData, tablesData);
      return combinedData;
    } catch (error) {
      console.error('Error scanning and extracting data:', error);
      throw error;
    }
  }
  

  // Function to upload data to MySQL
async function uploadDataToMySQL(data) {
    try {
      const connection = await mysql.createConnection({
        host: 'localhost', 
        user: 'root', 
        password: 'Nirmal15', 
        database: 'invoicehub', 
      });
  
      // Extract the data fields for MySQL table insertion
      const { InvoiceID, IssuedDate, DueDate, SupplierID, TotalBeforeGST, TotalAfterGST, GST } = data;
  
      // Assuming you have a table named 'Invoices' in your MySQL database with columns
      // corresponding to the extracted data fields, insert the data into the table.
      await connection.query(
        `INSERT INTO Invoices (InvoiceID, IssuedDate, DueDate, SupplierID, TotalBeforeGST, TotalAfterGST, GST) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [InvoiceID, IssuedDate, DueDate, SupplierID, TotalBeforeGST, TotalAfterGST, GST]
      );
  
      console.log('Data uploaded to MySQL successfully!');
      console.log(data);
      
      connection.end(); // Close the MySQL connection after data insertion
    } catch (error) {
      console.error('Error uploading data to MySQL:', error);
    }
  }


  // Example usage in a controller function
async function processOCRAndUploadToMySQL(filepath, dict1, dict2) {
    try {
      // Perform OCR and extract data
      const extractedData = await OCRandDataExtraction(filepath, dict1, dict2);
  
      // Upload the extracted data to MySQL
      await uploadDataToMySQL(extractedData);
  
      console.log('Invoice data extracted and uploaded to db successfully!');
    } catch (error) {
      console.error('Error processing invoices and uploading to db:', error);
    }
}


// Call the controller function with the file path and dictionary as needed
const filepath = 'C:/Users/user/InvoiceHub-draft/invoices-img/Invoice(3).pdf';
const dict1 = {
    headers: ['Invoice ID', 'Issued Date', 'Due Date','Supplier ID', 
    'Total Before GST','Total After GST', 'GST' ],
    mapping: {
    'Ref. No.':'Invoice ID', 'Ref And Particulars':'Invoice ID', 'Tax Invoice':'Invoice ID', 
    'Document No.':'Invoice ID', 'Doc. No.':'Invoice ID', 'References':'Invoice ID', 'No':'Invoice ID', 
    'Invoice No./ CN NO':'Invoice ID', 'Invoice no.':'Invoice ID', 'REF.':'Invoice ID', 
    'Inv. No.':'Invoice ID', 'DOCUMENT NO.':'Invoice ID', 'DOCUMENT NUMBER':'Invoice ID', 
    'Our Ref.':'Invoice ID', 'Document No':'Invoice ID', 'No.':'Invoice ID', 'Reference':'Invoice ID',
    'Balance':'Amount', 'Accumulated Balance':'Amount', 'Balance Amount':'Amount', 
    'Document Amount':'Amount', 'Amount':'Amount', 'BALANCE':'Amount', 
    'Accumulated balance(Functional currency)':'Amount', 
    'Accum Balance':'Amount', 'OUTSTANDING BALANCE':'Amount',    
    'Date':'Issued Date', 'DATE':'Issued Date', 'Tran.Date':'Issued Date', 'Posting Date':'Issued Date', 
    'Issues Date':'Issued Date', 'Invoice Date':'Issued Date',
    'Due Date':'Due Date', 'GST REG NO:':'Supplier ID', 'GST Reg No.:':'Supplier ID', 'GST Reg.No:':'Supplier ID', 
    'ST Reg. No.':'Supplier ID', 'GST Registration No':'Supplier ID',
    'GST Registration No.:':'Supplier ID','GST No :':'Supplier ID','GST REG.NO:':'Supplier ID',
    'Company Reg No & GST Reg No:':'Supplier ID','GST REG NO.':'Supplier ID','GST Reg. No.':'Supplier ID',
    'GST REG.NO':'Supplier ID','Product Code' : 'Product Code', 'Qty': 'QTY', 'GST 7%' : 'GST', 
     'Total' : 'Total Before GST', 'GRAND TOTAL' : 'Total After GST' 

}
};

const dict2 = {
headers: ['Product Code', 'Quantity', 'Amount', 'Product Name' ],
mapping: {
'Ref. No.':'Invoice ID', 'Ref And Particulars':'Invoice ID', 'Tax Invoice':'Invoice ID', 
'Document No.':'Invoice ID', 'Doc. No.':'Invoice ID', 'References':'Invoice ID', 'No':'Invoice ID', 
'Invoice No./ CN NO':'Invoice ID', 'Invoice no.':'Invoice ID', 'REF.':'Invoice ID', 
'Inv. No.':'Invoice ID', 'DOCUMENT NO.':'Invoice ID', 'DOCUMENT NUMBER':'Invoice ID', 
'Our Ref.':'Invoice ID', 'Document No':'Invoice ID', 'No.':'Invoice ID', 'Reference':'Invoice ID',
'Balance':'Amount', 'Accumulated Balance':'Amount', 'Balance Amount':'Amount', 
'Document Amount':'Amount', 'Amount':'Amount', 'BALANCE':'Amount', 
'Accumulated balance(Functional currency)':'Amount', 
'Accum Balance':'Amount', 'OUTSTANDING BALANCE':'Amount',    
'Date':'Issued Date', 'DATE':'Issued Date', 'Tran.Date':'Issued Date', 'Posting Date':'Issued Date', 
'Issues Date':'Issued Date', 'Invoice Date':'Issued Date',
'Due Date':'Due Date', 'GST REG NO:':'Supplier ID', 'GST Reg No.:':'Supplier ID', 'GST Reg.No:':'Supplier ID', 
'ST Reg. No.':'Supplier ID', 'GST Registration No':'Supplier ID',
'GST Registration No.:':'Supplier ID','GST No :':'Supplier ID','GST REG.NO:':'Supplier ID',
'Company Reg No & GST Reg No:':'Supplier ID','GST REG NO.':'Supplier ID','GST Reg. No.':'Supplier ID',
'GST REG.NO':'Supplier ID','Product Code' : 'Product Code', 'Qty': 'Quantity', 'GST 7%' : 'GST', 
 'Total' : 'Total Before GST', 'GRAND TOTAL' : 'Total After GST' , 'Description': 'Product Name'
}
};

 // Replace with any required dictionary or options for "ocrPackage"
processOCRAndUploadToMySQL(filepath, dict1, dict2);
module.exports = OCRandDataExtraction;