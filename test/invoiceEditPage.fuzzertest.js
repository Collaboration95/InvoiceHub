// Import any necessary libraries here (if needed)

// Function to perform fuzz testing on the update_data event listener
async function performFuzzTest(iterations) {
    try {
      const fuzzedData = [];
      for (let i = 0; i < iterations; i++) {
        // Generate fuzzed input data (if needed)
        const inputData = {
          inp_comp_name: generateFuzzedCompanyName(),
          inp_issue_date: generateRandomDate(),
          inp_total_amount: generateRandomAmount(),
          invoiceId: generateRandomId(),
          invoice_status: generateRandomeStatus()
        };
  
        // Execute the event listener with the fuzzed input values
        await simulateEvent(inputData);
  
        // Fuzzed input and output data can be stored in the fuzzedData array
        fuzzedData.push({
          iteration: i + 1,
          input: inputData,
        });
  
        // Add a delay (if needed) to simulate real-world usage patterns
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
  
      // Log the results or perform any further analysis as needed
      console.log('Fuzz testing completed successfully!');
      console.log('Fuzzed data for event listener:', fuzzedData);
    } catch (error) {
      console.error('Fuzz testing error:', error);
    }
  }
  
  // Function to generate fuzzed company names
function generateFuzzedCompanyName() {
    // You can generate different scenarios for the company name
    // For example, you can create an array of different company names
    const fuzzedCompanyNames = ['Company 1', 'Test Company', 'Sample Corp', 'ABC Inc', 'XYZ Ltd'];
  
    // Select a random company name from the fuzzed data for this iteration
    const randomIndex = Math.floor(Math.random() * fuzzedCompanyNames.length);
    return fuzzedCompanyNames[randomIndex];
}
  
function generateRandomId() {
    return Math.floor(Math.random() * (10000)) + 1;
}

function generateRandomAmount() {
    // Generate a random number between 1 and 1000
    const randomNumber = Math.floor(Math.random() * 1000) + 1;
  
    // Generate a random number between 0 and 99
    const randomDecimal = Math.floor(Math.random() * 100);
  
    // Combine the two numbers to form a 1-2 digit float
    const randomFloat = randomNumber + (randomDecimal / 100);
  
    return randomFloat;
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
    return `${day}/${month}/${year}`;
}

function generateRandomeStatus() {
    idx = Math.floor(Math.random() * (4));
    const status = ['DRAFT', 'OVERDUE', 'PAID', 'UNPAID']
    return status[idx];
}
  
  // Function to simulate the event listener (for testing purposes)
async function simulateEvent(inputData) {
    return new Promise(resolve => {
    
    // Set the values with the fuzzed input data
    const comp_name = inputData.inp_comp_name;
    const issue_date = inputData.inp_issue_date;
    const total_amount = inputData.inp_total_amount;
    const invoiceId = inputData.invoiceId;
    const invoice_status = inputData.status;
  
    // Validate date format (dd/mm/yyyy)
    const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    const dateComponents = issue_date.split('/');
    const day = parseInt(dateComponents[0], 10);
    const month = parseInt(dateComponents[1], 10);

    const amountRegex = /^\d+(\.\d{1,2})?$/;

    if (!dateRegex.test(issue_date)) {
        console.log("Invalid date format (dd/mm/yyyy)");
        return;
    } else if (day > 31 || month > 12) {
        console.log("Invalid day or month in the date string");
        return ;
    } else if (!amountRegex.test(total_amount)) {
        console.log("Invalid amount format (e.g., 123.45)");
        return;
    }

    setTimeout(resolve, 1000);
    });
  }
  
  // Set the number of iterations for fuzz testing
  const numIterations = 5;
  
  // Run the fuzz testing function
  performFuzzTest(numIterations);
  