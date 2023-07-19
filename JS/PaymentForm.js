// data from InvoiceData.js
import { data,updateInvoiceStatus } from './InvoiceData.js';

// Get the table element
var selectedTable = document.getElementById("selected_table");

var total_to_be_paid = 0;

// Retrieve the selected checkbox values from the URL query parameter
var urlParams = new URLSearchParams(window.location.search);
var selectedValues = urlParams.get("selectedValues");

// Split the selected values into an array
var selectedValuesArray = selectedValues.split(",");

// Generate the table rows for the selected values
for (var i = 0; i < selectedValuesArray.length; i++) {
  var selectedRowId = selectedValuesArray[i];

  
  // Find the corresponding invoice data based on the selected row ID
  var invoice = data.find(function(row) {
    return row.id === selectedRowId;
  });

  var amount = parseFloat(invoice.amount);
  total_to_be_paid += amount;

  // Add a new row to the table
  var newRow = selectedTable.insertRow();
  
  // Add cells to the row and populate them with the invoice data
  newRow.insertCell().textContent = invoice.id;
  newRow.insertCell().textContent = invoice.name;
  newRow.insertCell().textContent = invoice.date;
  newRow.insertCell().textContent = "$S " + invoice.amount;
  newRow.insertCell().textContent = invoice.status;
  
}

// Display the total amount
var totalAmountElement = document.getElementById("total_amount");
totalAmountElement.textContent = "Total Amount: $" + parseFloat(total_to_be_paid).toFixed(2);

// Get the submit button element
const submitButton = document.getElementById('submit-button');

const amountPaid = document.getElementById("amount_paid");

// Function to handle form submission
function handleFormSubmission(event) {
  event.preventDefault(); // Prevent the form from submitting

  // Convert the entered amount to a number
  var enteredAmount = parseFloat(amountPaid.value).toFixed(2);

  if (enteredAmount === parseFloat(total_to_be_paid).toFixed(2)) {

    localStorage.setItem('selectedInvoiceIds', JSON.stringify(selectedValuesArray));
    
    // Redirect to the payment page
    window.location.href = 'PaymentPage.html?redirect=true';
  } else {
    
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'The entered amount does not match the total amount to be paid. Please check again.',
    });
  }
}

// Add a submit event listener to the form
document.getElementById('form').addEventListener('submit', handleFormSubmission);


