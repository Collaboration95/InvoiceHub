// data from InvoiceData.js
import { data } from './InvoiceData.js';

var table = document.getElementById("invoice_table");
var selectedRows = []; // Array to track selected rows
var filterButtonClicked = false; // Flag to track if the filter button was clicked


// code for rendering the data
function showtable(data_arr) {
    // Sort the data by customer name and then by date
  data_arr.sort(function(a, b) {
    var nameA = a.name.toLowerCase();
    var nameB = b.name.toLowerCase();
    var dateA = new Date(a.date);
    var dateB = new Date(b.date);

    if (nameA < nameB) return -1;
    if (nameA > nameB) return 1;

    // If customer names are the same, sort by date
    if (dateA < dateB) return -1;
    if (dateA > dateB) return 1;

    return 0;
  });
  // set up the title of each column
  table.innerHTML = `
    <tr>
      <th>ID</th>
      <th>CUSTOMER NAME</th>
      <th>INVOICE DATE</th>
      <th>AMOUNT</th>
      <th>STATUS</th>
      <th>SELECT</th> <!-- New column for selection -->
    </tr>
  `;

  // Filter the data to show only unpaid or overdue payments
  data_arr = data_arr.filter(function(row) {
    var status = row.status.toLowerCase();
    return status === "unpaid" || status === "overdue";
  });

  // get the icons for edit, delete, and export
  for (var i = 0; i < data_arr.length; i++) {
    // var for saving the status' color column
    var statusColor = "";

    // classify the color for each status
    if (data_arr[i].status === "OVERDUE") {
      statusColor = "rgb(252, 183, 137)";
    }

    // render each row of data
    table.innerHTML += `
      <tr>
        <td>${data_arr[i].id}</td>
        <td>${data_arr[i].name}</td>
        <td>${data_arr[i].date}</td>
        <td>$S ${data_arr[i].amount}</td>
        <td style="background-color: ${statusColor};">${data_arr[i].status}</td>
        <td>
          <input type="checkbox" name="selectedRow" value="${data_arr[i].id}">
        </td> <!-- New column for selection -->
      </tr>
    `;
  }
}

// empty array for saving searched result
var searched = [];

/* CODE FOR CALCULATING THE COST FOR SUMMARY */

// get the elements for the cost
var total_outstanding_cost = document.getElementById("total_outstanding_cost");
var overdue_cost = document.getElementById("overdue_cost");
var due_cost = document.getElementById("due_cost");

// function for calculating the cost for summary
function calCost() {
    // Initialize the total cost variables
    var totalCost = 0;
    var overdueCost = 0;
    var unpaidCost = 0;
  
    // Loop through the selected rows
    for (var i = 0; i < selectedRows.length; i++) {
      var selectedRowId = selectedRows[i];
      
      // Find the corresponding invoice data based on the selected row ID
      var invoice = data.find(function(row) {
        return row.id === selectedRowId;
      });
  
      if (invoice) {
        var selectedAmount = parseFloat(invoice.amount);
        var selectedStatus = invoice.status.toLowerCase();
    
        // Add the amount of the selected row to the total cost
        totalCost += selectedAmount;
    
        // Categorize the amount based on the status
        if (selectedStatus === "overdue") {
          overdueCost += selectedAmount;
        } else if (selectedStatus === "unpaid") {
          unpaidCost += selectedAmount;
        }
      }
    }
    
    // Display the total costs
    total_outstanding_cost.textContent = "S$ " + totalCost.toFixed(2);
    overdue_cost.textContent = "S$ " + overdueCost.toFixed(2);
    due_cost.textContent = "S$ " + unpaidCost.toFixed(2);
  }

// code for rendering the data with default filters
function showDefaultData() {
  // Get the current month and year
  var currentDate = new Date();
  var currentMonth = currentDate.getMonth();
  var currentYear = currentDate.getFullYear();

  // Filter the data based on default conditions
  searched = data.filter(function(val) {
    var status = val.status.toLowerCase();
    var date = new Date(val.date);
    var invoiceMonth = date.getMonth();
    var invoiceYear = date.getFullYear();

    // Filter conditions:
    // - Invoices with the same month and year as the current date
    return invoiceMonth === currentMonth && invoiceYear === currentYear;
  });

  // Render the default filtered result
  showtable(searched);
}

// Call the function to show the default filtered data
showDefaultData();

// get the input for start and end dates
var startDateInput = document.getElementById("start_date");
var endDateInput = document.getElementById("end_date");
var filterButton = document.getElementById("filter_button");

// add event listener to the filter button
filterButton.addEventListener("click", function() {
  var startDate = startDateInput.value;
  var endDate = endDateInput.value;

  if (startDate && endDate) {
    // perform filtering based on the date range
    filterByDateRange(startDate, endDate);
    filterButtonClicked = true;
  } else {
    // show the default filtered data
    showDefaultData();
    filterButtonClicked = false;
  }
});

// get the input for searching and dropdown
var input = document.getElementById("inp_search_blank");
var searchDropdown = document.getElementById("search_type_dropdown");

//if no input, go back to default settings
if (input==null){
    showDefaultData();
}

// code for searching and filter based on it
input.addEventListener("keyup", function() {
  var searchInput = this.value.toLowerCase();
  var filterValue = searchDropdown.value;

  // convert all saved data into lower case for easy searching
  searched = data.filter(function(val) {
    var id = val.id.toLowerCase();
    var name = val.name.toLowerCase();
    var date = val.date.toLowerCase();
    var amount = val.amount.toLowerCase();
    var status = val.status.toLowerCase();

    // check if input and searched input are the same
    if (
      (filterValue === "id" && id.includes(searchInput)) ||
      (filterValue === "name" && name.includes(searchInput)) ||
      (filterValue === "date" && date.includes(searchInput)) ||
      (filterValue === "amount" && amount.includes(searchInput)) ||
      (filterValue === "status" && status.includes(searchInput))
    ) {
      // saved the searched result into a new dictionary
      var newobj = {
        id: val.id,
        name: val.name,
        date: val.date,
        amount: val.amount,
        status: val.status,
        action: ""
      };
      return newobj;
    }
  });

  // render the searched result
  showtable(searched);
});

searchDropdown.addEventListener("change", function() {
  input.value = "";
  showtable(data);
});

// code for searching and filtering based on date range
input.addEventListener("keyup", function() {
  var searchInput = this.value.toLowerCase();
  var filterValue = searchDropdown.value;

  // convert all saved data into lower case for easy searching
  searched = data.filter(function(val) {
    var id = val.id.toLowerCase();
    var name = val.name.toLowerCase();
    var date = val.date.toLowerCase();
    var amount = val.amount.toLowerCase();
    var status = val.status.toLowerCase();

    // check if input and searched input are the same
    if (
      (filterValue === "id" && id.includes(searchInput)) ||
      (filterValue === "name" && name.includes(searchInput)) ||
      (filterValue === "date" && date.includes(searchInput)) ||
      (filterValue === "amount" && amount.includes(searchInput)) ||
      (filterValue === "status" && status.includes(searchInput))
    ) {
      // saved the searched result into a new dictionary
      var newobj = {
        id: val.id,
        name: val.name,
        date: val.date,
        amount: val.amount,
        status: val.status,
        action: ""
      };
      return newobj;
    }
  });

  // render the searched result
  showtable(searched);
});

// Function to convert date format from YYYY-MM-DD to YYYY/MM/DD
function convertDateFormat(dateString) {
  var parts = dateString.split("-");
  var year = parts[0];
  var month = parts[1];
  var day = parts[2];
  return year + "/" + month + "/" + day;
}

// function for filtering data based on date range
function filterByDateRange(startDate, endDate) {
  var startDateObj = new Date(convertDateFormat(startDate));
  var endDateObj = new Date(convertDateFormat(endDate));

  // filter the data based on the date range
  searched = data.filter(function(val) {
    var dateObj = new Date(val.date);
    return dateObj >= startDateObj && dateObj <= endDateObj;
  });

  // render the filtered result
  showtable(searched);
}

// Call the function to show the default filtered data if the filter button was not clicked
if (!filterButtonClicked) {
  showDefaultData();
}

// Select All button
var selectAllButton = document.getElementById("selectAllButton");
selectAllButton.addEventListener("click", function() {
  var checkboxes = document.querySelectorAll('input[name="selectedRow"]');
  checkboxes.forEach(function(checkbox) {
    checkbox.checked = true;
  });
  checkSelectedRows();
  nextButton.disabled = false;
  calCost(); // Calculate the cost when the checkbox state changes
});

// Deselect All button
var deselectAllButton = document.getElementById("deselectAllButton");
deselectAllButton.addEventListener("click", function() {
  var checkboxes = document.querySelectorAll('input[name="selectedRow"]');
  checkboxes.forEach(function(checkbox) {
    checkbox.checked = false;
  });
  checkSelectedRows();
  nextButton.disabled = !isAnyCheckboxChecked();
  calCost(); // Calculate the cost when the checkbox state changes
});

// Add event listener to checkboxes
table.addEventListener("change", function(event) {
  if (event.target.name === "selectedRow") {
    checkSelectedRows();
    
    nextButton.disabled = !isAnyCheckboxChecked();
  }
});

// Next button
nextButton.addEventListener("click", function() {
    if (isAnyCheckboxChecked()) {
      // Get the selected checkbox values
      var selectedCheckboxValues = getSelectedCheckboxValues();
  
      // Encode the selected checkbox values as a query parameter
      var queryParams = new URLSearchParams();
      queryParams.append("selectedValues", selectedCheckboxValues.join(","));
  
      // Build the URL for the next page with the query parameter
      var nextPageURL = "PaymentForm.html?" + queryParams.toString();
  
      // Navigate to the next page
      window.location.href = nextPageURL;
    }
  });
  //retrieve selected checkbox values
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
  

function checkSelectedRows() {
    selectedRows = []; // Reset the selectedRows array
  
    var checkboxes = document.querySelectorAll('input[name="selectedRow"]');
    checkboxes.forEach(function(checkbox) {
      if (checkbox.checked) {
        selectedRows.push(checkbox.value);
      }
    });
  
    nextButton.disabled = !isAnyCheckboxChecked();
  }
  
  // Add event listener to checkboxes
  table.addEventListener("change", function(event) {
    if (event.target.name === "selectedRow") {
      checkSelectedRows();
      calCost(); // Calculate the cost when the checkbox state changes
    }
  });
  

function isAnyCheckboxChecked() {
  var checkboxes = document.querySelectorAll('input[name="selectedRow"]');
  for (var i = 0; i < checkboxes.length; i++) {
    if (checkboxes[i].checked) {
      return true;
    }
  }
  return false;
}
