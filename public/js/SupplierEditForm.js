document.addEventListener('DOMContentLoaded', init);

// Get the table element
var selectedTable = document.getElementById("selected_table");
// Retrieve the selected checkbox values from the URL query parameter
var urlParams = new URLSearchParams(window.location.search);
var selectedValues = urlParams.get("selectedValues");
//console.log("read");
//console.log(selectedValues);

let data;

// Split the selected values into an array
var selectedValuesArray = selectedValues.split(",");

async function init() {
  try {
    console.log("retrieving");
    data = await retrieveData(); // Retrieve data from the server
    showTable(data); // Display the data in the table

    // Display the default filtered result

  } catch (error) {
    // Handle any errors that occur during data retrieval
    console.error('Error initializing page:', error);
  }
}
 
// Function to fetch supplier data from the server
async function retrieveData() {
  try {
    const response = await fetch('/supplier/all'); // Fetch data from the /supplier/all endpoint
    data = await response.json();
    console.log(data);
    return data;

  } catch (error) {
    console.error('Error retrieving data from the server:', error);
    throw error;
  }
}

// Function to display the table
function showTable(data) {
    selected_table.innerHTML = `
    <tr>
            <th>COMPANY NAME</th>
            <th>CONTACT NUMBER</th>
            <th>ADDRESS</th>
            <th>EMAIL</th>
        </tr>
  `;

  // Loop through the data and create table rows
  data.forEach((supplier) => {
    //console.log(invoice.Invoice_id);
    if (selectedValuesArray.includes(String(supplier.Name))) {
      
      // company.textContent = supplier.company_name;
      const row = document.createElement('tr');
      row.innerHTML = ` 
      <td>${supplier.Name}</td>
      <td>${supplier.Telephone}</td>
      <td>${supplier.Address}</td>
      <td>${supplier.Email}</td>
    `;
    selectedTable.appendChild(row);
    document.getElementById("company_name").value = supplier.Name;
    document.getElementById("contact_number").value = supplier.Telephone;
    document.getElementById("Address").value = supplier.Address;
    document.getElementById("Email").value = supplier.Email;


    // // Calculate the total amount for selected invoices
    // var amount = parseFloat(invoice.total_cost);
    // total_to_be_paid += amount;
    }

  });

}

// Function to handle form submission
async function handleFormSubmission(event) {
    event.preventDefault(); // Prevent the form from submitting
  
    if (true) {
      try {
        // Prepare the data to be sent to the server
        //getting the various elements from the page 
        const company_name = document.getElementById("company_name").value;
        const contact_number = document.getElementById("contact_number").value;
        const Address = document.getElementById("Address").value;
        const Email = document.getElementById("Email").value;

             //company_name: String(selectedValuesArray),

        //creating the object formData below, containing the collected data
        const formData = {
          company_name : company_name,
          contact_number: contact_number,
          Address : Address,
          Email: Email
        };
        //updating the supplier information in the table 
      selectedValuesArray.forEach(async (company_name) => {
        try {
          const response = await fetch(`../supplier/update-supplier`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            //yet to edit from here
            body: JSON.stringify({ company_name: company_name, contact_number: contact_number, Address: Address, Email:Email}),
          });
  
          const responseData = await response.json();
          console.log(responseData); // Check the response data received from the server
  
  
          if (response.ok) {
            console.log(responseData.message); // Supplier updated successfully
          } else {
            console.error(responseData.error); // error updating status
          }
        } catch (error) {
          console.error('Error updating supplier:', error);
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'An error occurred while updating supplier. Please try again later.',
          });
        }
      });


        // Send a POST request to the server
        const response = await fetch('../supplier/form-data', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          body: JSON.stringify(formData),
        });
        //Parse the response data as JSON
        await response.json();
  
        if (response.ok) {
          // If the request is successful, redirect to the payment page
          window.location.href = 'NewSupplier.html?redirect=true';
        } else {
          // If there is an error, display an error message
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'An error occurred while processing the payment. Please try again later.',
          });
        }
      } catch (error) {
        console.error('Error processing payment:', error);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'An error occurred while processing the payment. Please try again later.',
        });
      }
      //window.location.href = 'PaymentPage.html?redirect=true';
    }
  }




// Add a submit event listener to the form
document.getElementById('form').addEventListener('submit', handleFormSubmission);


