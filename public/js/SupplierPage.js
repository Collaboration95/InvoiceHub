

// Declare data variable outside the init() function
let data;
var selectedRows = []; // Array to track selected rows
var table = document.getElementById("invoice_table");
var filter = false;

// Function to fetch data from the server
async function retrieveData() {
  try {
    const response = await fetch('/supplier/all'); // Fetch data from the /payment/all endpoint
    data = await response.json();
    return data;
  } catch (error) {
    console.error('Error retrieving data from the server:', error);
    throw error;
  }
}

// Function to display the table
function showTable(data) {
  
  table.innerHTML = `
    <tr>
      <th>Name</th>
      <th>Number</th>
      <th>Address</th>
      <th>Email</th>
      <th>EDIT</th> <!-- New column for Edditing -->
    </tr>
  `;

  // Loop through the data and create table rows
  data.forEach((supplier) => {
    
    const row = document.createElement('tr');
    // var for saving the status' color column
    
    row.innerHTML = ` 
      <td>${supplier.company_name}</td>
      <td>${supplier.contact_number}</td>
      <td>${supplier.address}</td>
      <td>${supplier.email}</td>
      <td><input type="checkbox" name="selectedRow" value="${supplier.company_name}"></td>
    `;
    table.appendChild(row);
  });
}

// Function to initialize the page
async function init() {
  try {
    data = await retrieveData(); // Retrieve data from the server
    showTable(data); // Display the data in the table


  } catch (error) {
    // Handle any errors that occur during data retrieval
    console.error('Error initializing page:', error);
  }
}

// Function to get selected checkbox values (invoice IDs)
function getSelectedCheckboxValues() {
  var checkboxes = document.querySelectorAll('input[name="selectedRow"]');
  var selectedValues = [];
  checkboxes.forEach(function(checkbox) {
    if (checkbox.checked) {
      selectedValues.push(checkbox.value);
    }
  });
  return selectedValues;
}

// Next button
document.getElementById("nextButton").addEventListener("click", function() {
  // Get the selected invoice IDs
  var selectedSupplier = getSelectedCheckboxValues();
  console.log("value",selectedSupplier);

  if (selectedSupplier.length > 0) {
    // Encode the selected invoice IDs as a query parameter
    var queryParams = new URLSearchParams();
    queryParams.append("selectedValues", selectedSupplier);

    // Build the URL for the next page with the query parameter
    var nextPageURL = "SupplierEditForm.html?" + queryParams.toString();

    // Navigate to the next page
    window.location.href = nextPageURL;
  }
});

// Call the init function when the page loads
document.addEventListener('DOMContentLoaded', init);


// Add event listener to the search input and dropdown
document.getElementById("inp_search_blank").addEventListener("keyup", function() {
  var searchInput = this.value.toLowerCase();
  var filterValue = document.getElementById("search_type_dropdown").value;

  // Convert all saved data into lower case for easy searching
  var searched = data.filter(function(val) {
    //console.log(val.Invoice_id);
    var id = String(val.Invoice_id);;
    var company_name = val.company_name.toLowerCase();
    //var date = formatDate(val.date_received);
    // var amount = val.total_cost.toLowerCase();
    // var status = val.status.toLowerCase();

    // Check if input and searched input are the same
    if (
      (filterValue === "id" && id.includes(searchInput)) ||
      (filterValue === "company_name" && company_name.includes(searchInput))
    ) {
        return val;
        
  
      }
      // Save the searched result into a new object
    
  });

  // Render the searched result
  showTable(searched);
});





// Add event listener to checkboxes
var table = document.getElementById("invoice_table");
table.addEventListener("change", function(event) {
  if (event.target.name === "selectedRow") {
      checkSelectedRows();

    //calCost(); // Calculate the cost when the checkbox state changes
  }
});

function checkSelectedRows() {
  selectedRows = []; // Reset the selectedRows array

  var checkboxes = document.querySelectorAll('input[name="selectedRow"]');
  checkboxes.forEach(function(checkbox) {
    if (checkbox.checked) {
      selectedRows.push(checkbox.value);
      console.log("checkbox",checkbox.value)
    }
  });

  //nextButton.disabled = !isAnyCheckboxChecked();
}

