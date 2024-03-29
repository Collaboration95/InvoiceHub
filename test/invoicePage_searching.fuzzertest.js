// const fetchData = require('../routes/invoice.js')

const mysql = require('mysql2/promise');

// Function to perform fuzz testing on the searching function
async function performFuzzTest(iterations) {
  try {
    const fuzzedData = [];
    for (let i = 0; i < iterations; i++) {
      const dropdownValue = generateFuzzedDropdown();
      const inputData = generateFuzzedInput(dropdownValue);
      
      // Execute the searching function with the fuzzed input and dropdown values
      await search(inputData, dropdownValue);

      // Fuzzed input and output data can be stored in the fuzzedData array
      fuzzedData.push({
        iteration: i + 1,
        input: inputData,
        dropdown: dropdownValue,
      });

      // Add a delay (if needed) to simulate real-world usage patterns
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Log the results or perform any further analysis as needed
    console.log('Fuzz testing completed successfully!');
    console.log('Fuzzed data for searching function:', fuzzedData);
  } catch (error) {
    console.error('Fuzz testing error:', error);
  }
}

// Function to generate fuzzed input data for the searching function
function generateFuzzedInput(dropdownValue) {
  let fuzzedInputData;

  if (dropdownValue == "id"){
    fuzzedInputData = [ generateRandomId(), generateRandomId(), generateRandomId(), generateRandomId(), generateRandomId()];
  } else if (dropdownValue == 'name'){
    fuzzedInputData = [ 'Invoice 1', 'Invoice 2', 'Invoice 3', 'Invoice 4', 'Invoice 5', 'Invoice 6', 'Invoice 7', 'Invoice 8', 'Invoice 9', 'Invoice 10',
    'Invoice 11', 'Invoice 12', 'Invoice 13', 'Invoice 14', 'Invoice 15', 'Invoice 16', 'Invoice 17', 'Invoice 18', 'Invoice 19', 'Invoice 20'];
  } else if (dropdownValue == 'date'){
    fuzzedInputData = [ generateRandomDate(), generateRandomDate(), generateRandomDate(), generateRandomDate(), generateRandomDate()];
  } else if (dropdownValue == 'amount'){
    fuzzedInputData = [ generateRandomAmount(), generateRandomAmount(), generateRandomAmount(), generateRandomAmount(), generateRandomAmount()];
  } else if (dropdownValue == 'status'){
    fuzzedInputData = [ generateRandomeStatus(), generateRandomeStatus(), generateRandomeStatus(), generateRandomeStatus(), generateRandomeStatus()];
  } 

  // Select a random input from the fuzzed data for this iteration
  const randomIndex = Math.floor(Math.random() * fuzzedInputData.length);
  return fuzzedInputData[randomIndex];
}

// Function to generate fuzzed dropdown value for the searching function
function generateFuzzedDropdown() {
  const fuzzedDropdownData = ['id', 'name', 'date', 'amount', 'status'];

  // Select a random dropdown value from the fuzzed data for this iteration
  const randomIndex = Math.floor(Math.random() * fuzzedDropdownData.length);
  return fuzzedDropdownData[randomIndex];
}

function generateRandomId() {
    return Math.floor(Math.random() * (11));
}

function generateRandomAmount() {
    return Math.floor(Math.random() * (1001));
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
    const fuzzedData = [];

    for (let i = 1; i <= 20; i++) {
        const data = {
        invoiceid: generateRandomId(),
        upload_date: generateRandomDate(),
        invoice_name: `Invoice ${i}`,
        total: generateRandomAmount(),
        status: generateRandomeStatus(),
        };
        fuzzedData.push(data);
    }

    return fuzzedData;
}
  


// Function to simulate the getData() function (for testing purposes)
async function getData() {
  // Simulate an asynchronous fetch operation and return the data
  return new Promise(resolve => {
    resolve(generateFuzzedData());
  });
}

// Function to simulate the search function (for testing purposes)
async function search(inputData, dropdownValue) {
  return new Promise(resolve => {
    getData().then(data => {
        console.log("Input Data :", inputData, " | Selected Dropdown Choice :", dropdownValue), "\n";
      // convert all saved data into lower case for easy searching
      const searched = data.filter(function (val) {
        var id = val.invoiceid.toString().toLowerCase();
        var name = val.invoice_name.toLowerCase();
        var date = val.upload_date.toLowerCase();
        var amount = val.total.toString().toLowerCase();
        var status = val.status;

        // check if input and searched input are the same
        return (
          (dropdownValue === 'id' && id.includes(inputData)) ||
          (dropdownValue === 'name' && name.includes(inputData)) ||
          (dropdownValue === 'date' && date.includes(inputData)) ||
          (dropdownValue === 'amount' && amount.includes(inputData)) ||
          (dropdownValue === 'status' && status.includes(inputData))
        );
      });

      // Simulate rendering the searched result
      if (searched.length == 0){
        console.log('no matched result');
      } else {
        console.log(searched);
      }
      resolve();
    });
  });
}

// Set the number of iterations for fuzz testing
const numIterations = 5;

// Run the fuzz testing function
performFuzzTest(numIterations);
