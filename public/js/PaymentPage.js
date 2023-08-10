// PaymentPage.js

// Declare data variable outside the init() function
let data;
var selectedRows = []; // Array to track selected rows
var table = document.getElementById("invoice_table");
var filter = false;

// Function to fetch data from the server
async function retrieveData() {
  try {
    const response = await fetch('/payment/all-invoice'); // Fetch data 
    data = await response.json();
    return data;
  } catch (error) {
    console.error('Error retrieving data from the server:', error);
    throw error;
  }
}


// Function to display the table
var arryaofid = []; 
function showTable(data) {
  console.log("data", data)
  
  table.innerHTML = `
    <tr>
      <th>ID</th>
      <th>COMPANY</th>
      <th>INVOICE DATE</th>
      <th>TOTAL COST</th>
      <th>STATUS</th>
      <th>SELECT</th> <!-- New column for selection -->
    </tr>
  `;

  // Loop through the data and create table rows
  data.forEach((invoice) => {
    console.log("invoice", invoice);
    
    const row = document.createElement('tr');
    // var for saving the status' color column
    var statusColor = "";
    var status = invoice.status.toUpperCase();

    // classify the color for each status
    if (status === "DRAFT") {
      statusColor = "#acacac";
    } else if (status === "OVERDUE") {
      statusColor = "rgb(252, 183, 137)";
    } else if (status === "PAID") {
      statusColor = "rgb(136, 197, 136)";
    }

    row.innerHTML = ` 
      <td>${invoice.invoiceid}</td>
      <td>${invoice.invoice_name}</td>
      <td>${formatDate(invoice.upload_date)}</td>
      <td>${invoice.total}</td>
      <td style="background-color: ${statusColor};" data-status="${status}" data-invoice-id="${invoice.invoiceid}">${status}</td>
      <td><input type="checkbox" name="selectedRow" value="${invoice.invoiceid}"></td>
    `;
    table.appendChild(row);
  });
  return table;
  
}

// Function to initialize the page
async function init() {
  try {
    data = await retrieveData(); // Retrieve data from the server
    showTable(data); // Display the data in the table

    // Sort the data by invoice date
    data.sort(function(a, b) {
      var dateA = new Date(a.date_received);
      var dateB = new Date(b.date_received);

      return dateA - dateB;
    });

    // Display the default filtered result
    showDefaultData();

  } catch (error) {
    // Handle any errors that occur during data retrieval
    console.error('Error initializing page:', error);
  }
}

// Function to show the default filtered data
function showDefaultData() {
  // Get the current month and year
  var currentDate = new Date();
  var currentMonth = currentDate.getMonth();
  var currentYear = currentDate.getFullYear();

  // Filter the data based on default conditions
  var searched = data.filter(function(val) {
    var date = new Date(val.upload_date);
    var invoiceMonth = date.getMonth();
    var invoiceYear = date.getFullYear();

    // Filter conditions:
    // - Invoices with the same month and year as the current date
    console.log(invoiceMonth, currentMonth, invoiceYear, currentYear);
    return val.status == "Overdue" || invoiceMonth === currentMonth && invoiceYear === currentYear;
  });

  // Render the default filtered result
  showTable(searched);

  // Calculate and display the cost for the default filtered result
  calCost();
}

// Function for calculating the cost for summary
function calCost() {
  // Initialize the total cost variables
  var totalCost = 0;
  var overdueCost = 0;
  var unpaidCost = 0;

  // Get the selected checkbox values
  var selectedInvoiceIds = getSelectedCheckboxValues();
  console.log("selected",selectedInvoiceIds);
  for (var i = 0; i < selectedInvoiceIds.length; i++) {
    var selectedRowId = selectedInvoiceIds[i];

    var invoice = data.find(function(row){
      return row.invoiceid == selectedRowId;
    });
    if (invoice) {
      var selectedAmount = parseFloat(invoice.total);
      var selectedStatus = invoice.status.toUpperCase();
  
      // Add the amount of the selected row to the total cost
      totalCost += selectedAmount;
  
      // Categorize the amount based on the status
      if (selectedStatus === "OVERDUE") {
        overdueCost += selectedAmount;
      } 
      if (selectedStatus === "UNPAID") {
        unpaidCost += selectedAmount;
      }
    }
  }

  // Display the total costs
  // document.getElementById("total_outstanding_cost").textContent = "S$ " + totalCost.toFixed(2);
  //document.getElementById("overdue_cost").textContent = "S$ " + overdueCost.toFixed(2);
  // document.getElementById("due_cost").textContent = "S$ " + unpaidCost.toFixed(2);
  console.log(totalCost,unpaidCost,overdueCost)
  document.getElementById("total_value").textContent = totalCost.toFixed(2);
  document.getElementById("total_due_value").textContent = unpaidCost.toFixed(2);
  document.getElementById("total_overdue_value").textContent = overdueCost.toFixed(2);
}
// Function to format date
function formatDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
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
  var selectedInvoiceIds = getSelectedCheckboxValues();

  if (selectedInvoiceIds.length > 0) {
    // Encode the selected invoice IDs as a query parameter
    var queryParams = new URLSearchParams();
    queryParams.append("selectedValues", selectedInvoiceIds.join(","));

    // Build the URL for the next page with the query parameter
    var nextPageURL = "PaymentForm.html?" + queryParams.toString();

    // Navigate to the next page
    window.location.href = nextPageURL;
  }
});

// Call the init function when the page loads
document.addEventListener('DOMContentLoaded', init);

// Add event listener to the filter button
document.getElementById("filter_button").addEventListener("click", function() {
  var startDate = document.getElementById("start_date").value;
  var endDate = document.getElementById("end_date").value;

  if (startDate && endDate) {
    // Perform filtering based on the date range
    filterByDateRange(startDate, endDate);
    filter = true;
  } else {
    // Show the default filtered data
    filter = false;
    showDefaultData();
  }
});

// Add event listener to the search input and dropdown
document.getElementById("inp_search_blank").addEventListener("keyup", function() {
  var searchInput = this.value.toLowerCase();
  var filterValue = document.getElementById("search_type_dropdown").value;

  // Convert all saved data into lower case for easy searching
  var searched = data.filter(function(val) {
    //console.log(val.Invoice_id);
    var id = String(val.invoiceid);;
    var name = val.invoice_name.toLowerCase();
    //var date = formatDate(val.date_received);
    // var amount = val.total_cost.toLowerCase();
    // var status = val.status.toLowerCase();

    // Check if input and searched input are the same
    if (
      (filterValue === "id" && id.includes(searchInput)) ||
      (filterValue === "name" && name.includes(searchInput))
    ) {
      if (filter){
        var startDate = document.getElementById("start_date").value;
        var endDate = document.getElementById("end_date").value;
        var startDateObj = new Date(startDate);
        var endDateObj = new Date(endDate);

        // Filter the data based on the date range
      
        var dateObj = new Date(val.upload_date);
        console.log("startdateobj",startDateObj);
        console.log("dateobj",dateObj);
        console.log("enddate",endDateObj);
        if(dateObj >= startDateObj && dateObj <= endDateObj){
          return val;
        }

      }
      else{
        var currentDate = new Date();
        var currentMonth = currentDate.getMonth();
        var currentYear = currentDate.getFullYear();

        // Filter the data based on default conditions
        var date = val.upload_date;
        var invoiceMonth = date.getMonth()+1;
        var invoiceYear = date.getFullYear();

        // Filter conditions:
        // - Invoices with the same month and year as the current date
        if(invoiceMonth === currentMonth && invoiceYear === currentYear){
        return val;
        }
  
      }
      // Save the searched result into a new object
    }
  });

  // Render the searched result
  showTable(searched);
});

// Function for filtering data based on date range
function filterByDateRange(startDate, endDate) {
  var startDate = document.getElementById("start_date").value;
  var endDate = document.getElementById("end_date").value;
  var startDateObj = new Date(startDate);
  var endDateObj = new Date(endDate);

  // Filter the data based on the date range
  var searched = data.filter(function(val) {
    var dateObj = new Date(val.upload_date);
    return dateObj >= startDateObj && dateObj <= endDateObj;
  });

  // Render the filtered result
  showTable(searched);

  // Calculate and display the cost for the filtered result
  calCost();
}

// Select All button
document.getElementById("selectAllButton").addEventListener("click", function() {
  var checkboxes = document.querySelectorAll('input[name="selectedRow"]');
  checkboxes.forEach(function(checkbox) {
    checkbox.checked = true;
  });
  checkSelectedRows();
  calCost(); // Calculate the cost when the checkbox state changes
});

// Deselect All button
document.getElementById("deselectAllButton").addEventListener("click", function() {
  var checkboxes = document.querySelectorAll('input[name="selectedRow"]');
  checkboxes.forEach(function(checkbox) {
    checkbox.checked = false;
  });
  checkSelectedRows();
  calCost(); // Calculate the cost when the checkbox state changes
});

// Add event listener to checkboxes
var table = document.getElementById("invoice_table");
table.addEventListener("change", function(event) {
  if (event.target.name === "selectedRow") {
    checkSelectedRows();
    calCost(); // Calculate the cost when the checkbox state changes
  }
});

function checkSelectedRows() {
  selectedRows = []; // Reset the selectedRows array

  var checkboxes = document.querySelectorAll('input[name="selectedRow"]');
  checkboxes.forEach(function(checkbox) {
    if (checkbox.checked) {
      selectedRows.push(checkbox.value);
    }
  });
  return selectedRows;

  //nextButton.disabled = !isAnyCheckboxChecked();
}

// Add event listener to checkboxes
table.addEventListener("change", function(event) {
  if (event.target.name === "selectedRow") {
    checkSelectedRows();
    calCost(); // Calculate the cost when the checkbox state changes
  }
});

// Add event listener to the table for status cells
table.addEventListener("click", function(event) {
  const targetCell = event.target;
  // Check if the clicked cell is a status cell and the status is "PAID"
  if (targetCell.tagName === "TD" && targetCell.dataset.status === "PAID") {
    const invoiceId = targetCell.dataset.invoiceId;
    if (invoiceId) {
      // Build the URL for the next page with the invoice number as a query parameter
      var queryParams = new URLSearchParams();
      queryParams.append("invoiceId", invoiceId);
      queryParams.append("SOAId", null );

      // Replace "NextPage.html" with the actual name of your next page
      var nextPageURL = "Paid.html?" + queryParams.toString();

      // Redirect to the next page
      window.location.href = nextPageURL;
    }

  }
});