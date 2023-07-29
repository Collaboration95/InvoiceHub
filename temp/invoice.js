const ocrPackage = require('./textractUtils.js');
const mysql = require('mysql2/promise'); 
const config = require('../../config.js');

// Configure AWS credentials and region
process.env.AWS_ACCESS_KEY_ID = config.awsAccesskeyID;
process.env.AWS_SECRET_ACCESS_KEY = config.awsSecretAccessKey;
process.env.AWS_REGION = config.awsRegion;

// perform OCR on invoices and extract data

