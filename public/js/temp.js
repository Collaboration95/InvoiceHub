function SOA(){
    document.getElementById(file);
    file.text="SOA"
    file.click();
  }

function Credit(){
    document.getElementById(file);
    file.text="Credit"
    file.click();
}

function Invoice(){
    document.getElementById(file);
    file.text="invoice";
    file.click();
}

function acceptFileInput() {
  const documentType =event.target.text;
    const file = event.target.files[0];
    const fileName = file.name;
    const formData = new FormData();
    formData.append('jpeg', file);
    const fileSizeInMB = file.size / (1024 * 1024);
    console.log('File Size:', fileSizeInMB.toFixed(2), 'MB');
  
    // Send the form data to the server-side script
    fetch('/invoice/save-image', {
      method: 'POST',
      body: formData
    })
      .then(response => response.json())
      .then(data=>{
        var invoiceid =Math.floor(Math.random() * (2500 - 200 + 1)) + 100;
        var invoice_name = fileName;
        var uploadDate = new Date().toISOString().split('T')[0];
        var status ="Unpaid";
        var fakeTotal = Math.floor(Math.random() * (2000 - 200 + 1)) + 200;
  
        var fakerequestBody = {
          user: localData.user,
          invoiceid: invoiceid,
          invoice_name: invoice_name,
          upload_date: uploadDate,
          status: status,
          path: data,
          total:fakeTotal,
          type:documentType
        }
  
        sessionStorage.setItem('invoiceid',JSON.stringify(fakerequestBody.invoiceid));
        
        // Send the POST request to the server
        fetch('/invoice/insert-record', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(fakerequestBody)
        })
          .then(response => {
            if (response.ok) {
              console.log('Record inserted successfully.');
            } else {
              console.error('Failed to insert the record.');
            }
          })
          .catch(error => {
            console.error('Error occurred while inserting the record:', error);
          });
      })
      .catch(error => {
        console.error('Error occurred while saving the image:', error);
  
      });
  
      detectTextBuckets(formData).then(detectedText=>{
      const output = extractDetails(detectedText.invoice_data);
      const output2 = sanitizeDetails(output,detectedText.table_data);
      const payload= {extractedDetails :output2, table_data:detectedText.table_data};
      console.log(payload);

  
        fetch('/invoice/save-detected-data', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ invoiceid:JSON.parse(sessionStorage.getItem('invoiceid')), detectedText: JSON.stringify(payload) })
        }).then(response=>response.json())
        .then(data=>{
        });
      })
      .catch(error=>{
        console.error("Error occured"+error);
      })
  
  
  }
  async function detectTextBuckets(formData) {
    try {
      const response = await fetch('/rekognition/upload-jpeg-bucket', {
        method: 'POST',
        body: formData
      });
      const data = await response.json(); // Convert the response to JSON
      return data;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }


function extractDetails(ocrResult) {
  console.log(ocrResult);
  const validTypes = {
    Id:["INVOICE_RECEIPT_ID","INVOICE_ID"],
    Name: ["VENDOR_NAME", "NAME"],
    Address: ["VENDOR_ADDRESS","ADDRESS"],
    Telephone: ["VENDOR_PHONE"],
    Total: ["TOTAL","SUBTOTAL"],
    IssuedDate: ["INVOICE_RECEIPT_DATE"]
  };

  const extractEmailAddresses = (data) => [].concat(...data.map(({ value }) => (value.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g) || [])));
  const keyvalue = {Id:[],Name:[],Address:[],Telephone:[],Total:[],IssuedDate:[]};
  
    ocrResult.forEach(item=>{
      for (const category in validTypes) {
        if (validTypes[category].includes(item.type)) {
          if(keyvalue[category].includes(item.value)){
            continue; // Skip duplicate values
          }
          else{
            keyvalue[category].push(item.value);
          }
        }
      }
    });
    keyvalue.email = extractEmailAddresses(ocrResult);
    return keyvalue;
  }
  
  
  function sanitizeDetails(details,input){
    console.log(details);
    const flatInput = input.flat();
    // Bug fix later 
    // const uniqueWordsList = Array.from(new Set(flatInput.join(' ').split(/\s+/).map(word => word.replace(/[^a-zA-Z]/g, ''))));
    const arrayToRemove = ["Kim Eng ", "BLK 103 YISHUN"];
    console.log(arrayToRemove);
    Object.keys(details).forEach(key => {
      if (Array.isArray(details[key])) {
          details[key] = details[key].filter(value => {
              const lowercaseValue = value.toLowerCase();
              return !arrayToRemove.some(removeValue => lowercaseValue.includes(removeValue.toLowerCase()));
          });
      }

  });
  
  if (details.Name.length >1) {
    const longestName = details.Name.reduce((longest, current) => (current.length > longest.length ? current : longest), "");
    details.Name[0]=longestName;
  }

  console.log(details.Total);
  details.IssuedDate= details.IssuedDate.map(dateString => convertToSqlDateFormat(dateString));
  details.Total= details.Total.map(total => total.replace(/[^0-9.]/g, ''));
  const maxNumber = Math.max(...details.Total);
  details.Total= [maxNumber];
  return details;
  }
  
  
  function convertToSqlDateFormat(dateString) {
    const parts = dateString.match(/(\d{1,2})[./](\d{1,2})[./](\d{2}|\d{4})/);
    if (!parts) {
      throw new Error('Invalid date format');
    }
    const day = parts[1].padStart(2, '0');
    const month = parts[2].padStart(2, '0');
    let year = parts[3];
    
    if (year.length === 2) {
      // Convert 2-digit year to 4-digit format
      const currentYear = new Date().getFullYear().toString().slice(0, 2);
      year = currentYear + year;
    }
  
    return `${year}-${month}-${day}`;
  }