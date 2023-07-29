async function processOCR(filepath, dict1, dict2) {
    try {
        // Perform OCR and extract data
        const extractedData = await OCRandDataExtraction(filepath, dict1, dict2);
        console.log(extractedData);
        // Upload the extracted data to MySQL

        console.log('Invoice data extracted');
      } catch (error) {
        console.error('Error processing invoices and uploading to db:', error);
      }
  }

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

    
    async function getAsyncAnalysis(key, textractClient) {   

        // Initialise params, create command object
        const params = {
        DocumentLocation: {
        
         "S3Object":{
               "Bucket":"ocr-scanned-invoices",
               "Name":key
         } 
        },
        FeatureTypes: ["FORMS", "TABLES"]
        };
        
        const startCommand = new StartDocumentAnalysisCommand(params);
        
        
        // run StartDocumentAnalysis
        const startCommandResult = await textractClient.send(startCommand);
        const jobid = startCommandResult.JobId; // read the jobid so we can read the results later
        // console.log(startCommandResult)
        
        // initialise params and command for GetDocumentAnalysis
        const getCommand = new GetDocumentAnalysisCommand( { "JobId": jobid} );
        
        // run loop to check for GetDocumentAnalysis
        var finished = false;
        var data;
        
        while (!finished) {
           // set timer for the while loop
           await wait(1500);
           data =  await textractClient.send(getCommand);
           if (data.JobStatus !== "IN_PROGRESS") {
               // once finished analysis, break out of the loop'
               finished = true;
           }
        }
        // check for failure of analysis:
        if (data.JobStatus === "FAILED") {
           console.log("Analysis Failed : ( ");
           return (null);
        }
        return data;
        }

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