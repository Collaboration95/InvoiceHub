// Final checked by ramita and radhi (11/08)
document.addEventListener('DOMContentLoaded', init);

// Get the table element
var selectedTable = document.getElementById("selected_table");

var total_to_be_paid = 0;
let data;
var selectedImage = null;
var enteredAmount;
var date;

// Retrieve the selected checkbox values from the URL query parameter
var urlParams = new URLSearchParams(window.location.search);
var selectedValues = urlParams.get("Invoice");
var SOA = urlParams.get("SOA");
console.log("SOA",SOA);
console.log("selectedvalue",selectedValues);

// Split the selected values into an array
var selectedValuesArray = selectedValues.split(",");

var selectedSOA = SOA.split(",");
//console.log(selectedValuesArray);

// Function to fetch data from the server
async function retrieveData() {
  try {
    const response = await fetch('/invoice/get-all-soa-invoice'); // Fetch data from the /payment/all endpoint
    data = await response.json();
    //console.log(data);
    return data;
  } catch (error) {
    console.error('Error retrieving data from the server:', error);
    throw error;
  }
}

// Function to display the table
function showTable(data) {

  // Loop through the data and create table rows
  data.forEach((invoice) => {
    if (selectedValuesArray.includes(String(invoice.invoiceid))) {
      const row = document.createElement('tr');
      row.innerHTML = ` 
      <td>${invoice.invoiceid}</td>
      <td>${invoice.invoice_name}</td>
      <td>${formatDate(invoice.upload_date)}</td>
      <td>${formatItems(invoice.detectedText)}</td>
      <td>${invoice.total}</td>
      <td>${invoice.status}</td>
    `;
    selectedTable.appendChild(row);

    // Calculate the total amount for selected invoices
    var amount = parseFloat(invoice.total);
    total_to_be_paid += amount;
    }

  });

// Display the total amount
var totalAmountElement = document.getElementById("total_amount");
console.log(total_to_be_paid);
totalAmountElement.textContent = "Total Amount: $" + parseFloat(total_to_be_paid).toFixed(2);

}

async function init() {
  try {
    console.log("retrieving");
    data = await retrieveData(); // Retrieve data from the server

    // Sort the data by invoice date
    data.sort(function(a, b) {
      var dateA = new Date(a.date_received);
      var dateB = new Date(b.date_received);

      return dateA - dateB;
    });
    showTable(data); // Display the data in the table

    // Display the default filtered result

  } catch (error) {
    // Handle any errors that occur during data retrieval
    console.error('Error initializing page:', error);
  }
}
function formatItems(items) {
    console.log(items);
    if (items == null){
      return "no item";
    }
    else{
      return "item";
    }
  }

// Function to format date
function formatDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Get the submit button element
const submitButton = document.getElementById('submit-button');

const amountPaid = document.getElementById("amount_paid");

const paymentTypeSelect = document.getElementById('payment_type');
paymentTypeSelect.addEventListener('change', function () {
  if (paymentTypeSelect.value === 'paynow') {
    imageUpload.removeAttribute('disabled');
  } else {
    imageUpload.setAttribute('disabled', 'disabled');
  }
});

imageUpload.addEventListener("change", function () {
  selectedImage = this.files[0];
});

function acceptFileInput() {
  const fileName = selectedImage.name;
  const formData = new FormData();
  formData.append('jpeg', selectedImage);
  const fileSizeInMB = selectedImage.size / (1024 * 1024);
  console.log('File Size:', fileSizeInMB.toFixed(2), 'MB');

  // Send the form data to the server-side script
  fetch('/paid/uploadImage', {
    method: 'POST',
    body: formData
  })
    .then(response => response.json())
    .then(()=>{
      var body = {
        invoiceId: String(selectedValuesArray),
        Company: "Company",
        amount_paid: parseFloat(amountPaid.value).toFixed(2),
        payment_type: paymentTypeSelect.value,
        payment_date: document.getElementById("date_input").value,
        payment_image: fileName,
        soa: SOA,
      }
      sessionStorage.setItem('invoiceid',JSON.stringify(body.invoiceid));
      
      // Send the POST request to the server
      fetch('/paid/form-data-soa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
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

}


// Function to handle form submission
async function handleFormSubmission(event) {
  event.preventDefault(); // Prevent the form from submitting

  // Convert the entered amount to a number
  var enteredAmount = await parseFloat(amountPaid.value).toFixed(2);
  const date = document.getElementById("date_input").value;

  if (enteredAmount === parseFloat(total_to_be_paid).toFixed(2)) {
      console.log(enteredAmount);
      console.log(date);
      await acceptFileInput();
      console.log(enteredAmount);
      
      //Update the status of invoices to "PAID" in the data array
      selectedValuesArray.forEach(async (invoiceId) => {
        try {
          const response = await fetch(`/payment/update-status`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: 'PAID', invoiceid: invoiceId }),
          });

          const responseData = await response.json();
          console.log(responseData); // Check the response data received from the server

          if (response.ok) {
            console.log(responseData.message); // Status updated successfully
          } else {
            console.error(responseData.error); // Invoice not found or error updating status
          }
        } catch (error) {
          console.error('Error updating status:', error);
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'An error occurred while updating status. Please try again later.',
          });
        }
      });

      // Update the status of soa to "PAID" in the data array
      selectedSOA.forEach(async (SOA) => {
        try {
          const response = await fetch(`../payment/update-soa-status`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: 'PAID', invoiceid: SOA }),
          });

          const responseData = await response.json();
          console.log(responseData); // Check the response data received from the server

          if (response.ok) {
            console.log(responseData.message); // Status updated successfully
          } else {
            console.error(responseData.error); // Invoice not found or error updating status
          }
        } catch (error) {
          console.error('Error updating status:', error);
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'An error occurred while updating status. Please try again later.',
          });
        }
      });

      // If the request is successful, redirect to the payment page
      setTimeout(() => {
        window.location.href = 'SOAPage.html?redirect=true';
      }, 100);

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
