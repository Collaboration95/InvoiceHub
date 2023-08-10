const mysql = require('mysql2/promise')

// Function to perform fuzz testing on sort_des() and sort_asc()
async function performFuzzTest(iterations) {
    try {
      const fuzzedDataSortDes = [];
      const fuzzedDataSortAsc = [];
  
      for (let i = 0; i < iterations; i++) {
        // Generate fuzzed input data
        const data = generateFuzzedData();
        const choice = generateRandomeSelection();
  
        // Execute the sort_des() function
        await sort_des(data, choice);
  
        // Fuzzed input and output data can be stored in the fuzzedDataSortDes array
        fuzzedDataSortDes.push({
          iteration: i + 1,
          input: data, 
        });
  
        // Execute the sort_asc() function
        await sort_asc(data, choice);
  
        // Fuzzed input and output data can be stored in the fuzzedDataSortAsc array
        fuzzedDataSortAsc.push({
          iteration: i + 1,
          input: data, 
        });
  
        // Add a delay (if needed) to simulate real-world usage patterns
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
  
      // Log the results or perform any further analysis as needed
      console.log('Fuzz testing completed successfully!');
      console.log('Fuzzed data for sort_des():', fuzzedDataSortDes);
      console.log('Fuzzed data for sort_asc():', fuzzedDataSortAsc);
    } catch (error) {
      console.error('Fuzz testing error:', error);
    }
  }
  
  function generateRandom() {
    return Math.floor(Math.random() * (10001));
}

function generateRandomDate() {
  const minTimestamp = (new Date('2000-01-01')).getTime();
  const maxTimestamp = (new Date('2023-12-31')).getTime();
  const randomTimestamp = Math.floor(Math.random() * (maxTimestamp - minTimestamp + 1)) + minTimestamp;
  const randomDate = new Date(randomTimestamp);
  
  // Get the day, month, and year from the randomDate
  const day = String(randomDate.getDate()).padStart(2, '0');
  const month = String(randomDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based, so we add 1
  const year = randomDate.getFullYear();
  
  // Return the date, month, and year in the format "DD-MM-YYYY"
  return `${day}-${month}-${year}`;
}


function generateRandomeStatus() {
    idx = Math.floor(Math.random() * (4));
    const status = ['DRAFT', 'OVERDUE', 'PAID', 'UNPAID']
    return status[idx];
}

  // Function to generate fuzzed input data 
function generateFuzzedData() {
  const fuzzedData = [
    { invoiceid: generateRandom(), upload_date: generateRandomDate(), invoice_name: 'Invoice 1', total: generateRandom(), status: generateRandomeStatus()},
    { invoiceid: generateRandom(), upload_date: generateRandomDate(), invoice_name: 'Invoice 2', total: generateRandom(), status: generateRandomeStatus()},
    { invoiceid: generateRandom(), upload_date: generateRandomDate(), invoice_name: 'Invoice 3', total: generateRandom(), status: generateRandomeStatus()},
    { invoiceid: generateRandom(), upload_date: generateRandomDate(), invoice_name: 'Invoice 4', total: generateRandom(), status: generateRandomeStatus()},
    { invoiceid: generateRandom(), upload_date: generateRandomDate(), invoice_name: 'Invoice 5', total: generateRandom(), status: generateRandomeStatus()}
  ];
  return fuzzedData;
}  

function generateRandomeSelection() {
  idx = Math.floor(Math.random() * (4));
  const status = ['id_choice', 'id_date', 'id_name', 'id_amount']
  return status[idx];
}
  

  // Function to simulate the sort_des() function (for testing purposes)
  async function sort_des(data, selectedValue) {
    return new Promise(resolve => {
      console.log(selectedValue, "will be sorted in descending order");
      if (selectedValue === 'id_choice') {
        data.sort(function (a, b) {
          return parseInt(a.invoiceid) - parseInt(b.invoiceid);
        });
      } else if (selectedValue === 'id_date') {
        data.sort(function (a, b) {
          const dateA = new Date(a.upload_date);
          const dateB = new Date(b.upload_date);
          return dateB - dateA;
        });
      } else if (selectedValue === 'id_name') {
        data.sort(function (a, b) {
          return a.invoice_name.localeCompare(b.invoice_name);
        });
      } else if (selectedValue === 'id_amount') {
        data.sort(function (a, b) {
          return parseInt(a.total) - parseInt(b.total);
        });
      }
      // Simulate rendering the sorted data
      console.log(data);
      resolve();
    });
  }
  
  // Function to simulate the sort_asc() function (for testing purposes)
  async function sort_asc(data, selectedValue) {
    return new Promise(resolve => {
      console.log(selectedValue, "will be sorted in ascending order");
      if (selectedValue === 'id_choice') {
        data.sort(function (a, b) {
          return parseInt(b.invoiceid) - parseInt(a.invoiceid);
        });
      } else if (selectedValue === 'id_date') {
        data.sort(function (a, b) {
          const dateA = new Date(a.upload_date);
          const dateB = new Date(b.upload_date);
          return dateA - dateB;
        });
      } else if (selectedValue === 'id_name') {
        data.sort(function (a, b) {
          return b.invoice_name.localeCompare(a.invoice_name);
        });
      } else if (selectedValue === 'id_amount') {
        data.sort(function (a, b) {
          return parseInt(b.total) - parseInt(a.total);
        });
      }
      // Simulate rendering the sorted data
      console.log(data);
      resolve();
    });
  }
  
  // Set the number of iterations for fuzz testing
  const numIterations = 5;
  
  // Run the fuzz testing function
  performFuzzTest(numIterations);
  