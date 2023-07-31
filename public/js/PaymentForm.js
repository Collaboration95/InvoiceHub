// PaymentForm.js
document.addEventListener('DOMContentLoaded', init);

// Get the table element
var selectedTable = document.getElementById("selected_table");

var total_to_be_paid = 0;
let data;

// Retrieve the selected checkbox values from the URL query parameter
var urlParams = new URLSearchParams(window.location.search);
var selectedValues = urlParams.get("selectedValues");
console.log("read");
console.log(selectedValues);

// Split the selected values into an array
var selectedValuesArray = selectedValues.split(",");

// Function to fetch data from the server
async function retrieveData() {
  try {
    const response = await fetch('/payment/all'); // Fetch data from the /payment/all endpoint
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
    //console.log(invoice.Invoice_id);
    if (selectedValuesArray.includes(String(invoice.Invoice_id))) {
      const row = document.createElement('tr');
      row.innerHTML = ` 
      <td>${invoice.Invoice_id}</td>
      <td>${invoice.Company}</td>
      <td>${formatDate(invoice.date_received)}</td>
      <td>${formatItems(invoice.items)}</td>
      <td>${invoice.total_cost}</td>
      <td>${invoice.status}</td>
    `;
    selectedTable.appendChild(row);

    // Calculate the total amount for selected invoices
    var amount = parseFloat(invoice.total_cost);
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
  const splitItems = items.split(",");
  const formattedLines = splitItems.map((line) => {
    const [quantity, item, price] = line.split('-');
    const cost = parseFloat(price).toFixed(2);

    const formattedItem =
      quantity.trim() +
      ' ' +
      item.trim() +
      (parseInt(quantity) > 1 ? 's' : '');

    return formattedItem + ' -> Cost: $' + cost;
  });

  return formattedLines.join('\n');
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

// Function to handle file selection for image upload
function handleImageUpload(event) {
  const fileInput = event.target;
  const file = fileInput.files[0];

  if (file) {
    // Create a FileReader to read the file as data URL
    const reader = new FileReader();
    reader.onload = function () {
      // Set the data URL as the src attribute of the image element to display the preview
      const imagePreview = document.getElementById('imagePreview');
      imagePreview.src = reader.result;
      imagePreview.style.display = 'block';
    };
    reader.readAsDataURL(file);
  } else {
    console.log("No image selected.");
  }
}

// Add an event listener to the file input element
document.getElementById('imageUpload').addEventListener('change', handleImageUpload);


// Function to handle form submission
async function handleFormSubmission(event) {
  event.preventDefault(); // Prevent the form from submitting

  // Convert the entered amount to a number
  var enteredAmount = parseFloat(amountPaid.value).toFixed(2);

  if (enteredAmount === parseFloat(total_to_be_paid).toFixed(2)) {
    try {
      // Prepare the data to be sent to the server
      const date = document.getElementById("date_input").value;
      console.log("date", date);

      const formData = {
        invoiceId: String(selectedValuesArray),
        Company: "testphoto",
        amount_paid: enteredAmount,
        payment_type: paymentTypeSelect.value,
        payment_date: date,
      };

      // Update the status of invoices to "PAID" in the data array
      selectedValuesArray.forEach(async (invoiceId) => {
        try {
          const response = await fetch(`../payment/update-status`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: 'PAID', invoiceId: invoiceId }),
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

      // Send a POST request to the server to save the form data
      const formDataResponse = await fetch('../paid/form-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      // Parse the response data as JSON
      const formDataResponseData = await formDataResponse.json();

      if (!formDataResponse.ok) {
        console.error('Error saving form data:', formDataResponseData);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'An error occurred while saving form data. Please try again later.',
        });
        return; // Exit the function if there's an error in form data saving
      }

      // Check if an image is uploaded
      const imageUpload = document.getElementById('imageUpload');
      if (imageUpload.files.length > 0) {
        //console.log("run"); works
        const image = imageUpload.files[0];
        //console.log("image", image); works
        // Create a FormData object to send the image
        const imageFormData = new FormData();
        imageFormData.append('image', image);
        console.log("image2",imageFormData);


        // Send a POST request to the server to save the image associated with the invoiceId
        const imageUploadResponse = await fetch(`../paid/uploadImage`, {
          method: 'POST',
          //body: imageFormData,
          body:image,
        });

        // Parse the image upload response data as JSON
        const imageUploadResponseData = await imageUploadResponse.json();

        if (!imageUploadResponse.ok) {
          console.error('Error uploading image:', imageUploadResponseData);
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'An error occurred while uploading the image. Please try again later.',
          });
          return; // Exit the function if there's an error in image uploading
        }
      }

    } catch (error) {
      console.error('Error processing payment:', error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'An error occurred while processing the payment. Please try again later.',
      });
    }

      // If the request is successful, redirect to the payment page
      //window.location.href = 'PaymentPage.html?redirect=true';

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
