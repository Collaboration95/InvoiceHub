var table = document.getElementById("invoice_table");

// Function to fetch data from the server
async function getData() {
  try {
    const response = await fetch('/invoice/get-all-invoices');
    const data = await response.json();
    data.forEach(invoice => {
      // Determine statusColor based on status
      if (invoice.status.toUpperCase() === 'DRAFT') {
        invoice.statusColor = '#acacac';
      } else if (invoice.status.toUpperCase() === 'OVERDUE') {
        invoice.statusColor = 'rgb(252, 183, 137)';
      } else if (invoice.status.toUpperCase() === 'PAID') {
        invoice.statusColor = 'rgb(136, 197, 136)';
      }
    });
    return data;
  } catch (error) {
    console.error('Error fetching invoices data:', error);
  }
}

// Function to render the table with data
function renderTable(data) {
  // set up the title of each column
  table.innerHTML = `
    <tr>
      <th>ID</th>
      <th>COMPANY NAME</th>
      <th>ISSUED DATE</th>
      <th>AMOUNT</th>
      <th>STATUS</th>
      <th>ACTION</th>
    </tr>
  `;
  // Render each row of data
  data.forEach(invoice => {
    invoice.upload_date = new Date(invoice.upload_date);
    const options = { timeZone: 'Asia/Singapore' };
    invoice.upload_date = (invoice.upload_date).toLocaleDateString('en-SG', options);

    var previewIcon = `
        <a href="#">
          <svg xmlns="http://www.w3.org/2000/svg"  onclick="openImage(this.getAttribute('value'))" value='${invoice.path}' width="16" height="16" fill="currentColor" class="bi bi-eye" viewBox="0 0 16 16">
            <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
            <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
          </svg>
        </a>`
    var editIcon = `
        <a href="#">
          <svg class="ic_edit" id="${invoice.invoiceid}" status="${invoice.status}" name="${invoice.invoice_name}" date="${invoice.upload_date}" amount="${invoice.total}" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16">
            <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
          </svg>
        </a>`;
    var deleteIcon = `
        <svg class="ic_delete" id="${invoice.invoiceid}" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
            <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"/>
          </svg>`;

    var exportIcon = `
          <a href="#" onclick="exportToCSV(${invoice.invoiceid})">
            <svg class="ic_export" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-box-arrow-right" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"/>
              <path fill-rule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/>
            </svg>
          </a>`;

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

    // render each row of data
    table.innerHTML += `
          <tr>
            <td>${invoice.invoiceid}</td>
            <td>${invoice.invoice_name}</td>
            <td>${invoice.upload_date}</td>
            <td>$S ${invoice.total}</td>
            <td style="background-color: ${statusColor};">${status}</td>
            <td>${previewIcon} ${editIcon} ${deleteIcon} ${exportIcon}</td>
          </tr>`;
  });
}

// Call getData() and renderTable() when the page loads
document.addEventListener('DOMContentLoaded', () => {
  getData().then(data => renderTable(data));
});


// // Add event listener for delete icon using event delegation
table.addEventListener("click", function (event) {
  if (event.target.classList.contains("ic_delete")) {
    // Retrieve the invoice id from the data attribute
    var invoiceId = event.target.getAttribute("id");

    // Show a confirmation popup
    var confirmed = confirm("Are you sure you want to delete this invoice?");

    if (confirmed) {
      fetch('/invoice/invoiceid', {
        method: "DELETE",
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({ invoiceid: (invoiceId) }),
      });
    }
    getData().then(data => renderTable(data));
  }
});

// Add event listener for edit icon using event delegation
table.addEventListener("click", function (event) {
  if (event.target.classList.contains("ic_edit")) {
    var invoiceId = event.target.getAttribute("id");
    var invoiceStatus = event.target.getAttribute("status");
    var invoiceName = event.target.getAttribute("name");
    var invoiceDate = event.target.getAttribute("date");
    var invoiceAmount = event.target.getAttribute("amount");
    localStorage.setItem('invoiceId', invoiceId);
    localStorage.setItem('invoiceStatus', invoiceStatus);
    localStorage.setItem('invoiceName', invoiceName);
    localStorage.setItem('invoiceDate', invoiceDate);
    localStorage.setItem('invoiceAmount', invoiceAmount);
    window.location.href = 'InvoiceEditPage.html';
  }
});


/* CODE FOR CALCULATING THE COST FOR SUMMARY */

// TODO: get the elements for the cost
var total_outstanding_cost = document.getElementById("total_outstanding_cost");
var overdue_cost = document.getElementById("overdue_cost");
var due_cost = document.getElementById("due_cost");


/* CODE FOR THE SEARCHING FUNCTION */

// empty array for saving searched result
var searched = [];

// get the input for searching and dropdown
var input = document.getElementById("inp_search_blank");
var searchDropdown = document.getElementById("search_type_dropdown");

// code for searching and filter based on it
input.addEventListener("keyup", function () {
  var searchInput = this.value.toLowerCase();
  var filterValue = searchDropdown.value;

  getData().then(data => {

    // convert all saved data into lower case for easy searching
    searched = data.filter(function (val) {
      var id = val.invoiceid.toString().toLowerCase();
      var name = val.invoice_name.toLowerCase();
      var date = val.upload_date.toLowerCase();
      var amount = val.total.toLowerCase();
      var status = val.status.toLowerCase();

      // check if input and searched input are the same
      return (
        (filterValue === "id" && id.includes(searchInput)) ||
        (filterValue === "name" && name.includes(searchInput)) ||
        (filterValue === "date" && date.includes(searchInput)) ||
        (filterValue === "amount" && amount.includes(searchInput)) ||
        (filterValue === "status" && status.includes(searchInput))
      );
    });

    // render the searched result
    renderTable(searched);
  });
});


searchDropdown.addEventListener('change', function () {
  input.value = '';
  getData().then(data => renderTable(data));
});


/* CODE FOR SORT/ SORTING FUNCTION */

/* SORTING WITH DROPDOWN */

// get the dropdown
var sortDropdown = document.getElementById('sort_dropdown');
var ascendingButton = document.getElementById('ic_sort_asc');
var descendingButton = document.getElementById('ic_sort_des');

ascendingButton.addEventListener('click', function () {
  if (searched.length === 0) {
    sort_asc();
  } else {
    sort_asc();
  }
});

descendingButton.addEventListener('click', function () {
  if (searched.length === 0) {
    sort_des();
  } else {
    sort_des();
  }
});

function sort_des() {
  getData().then(data => {
    var selectedValue = sortDropdown.value;

    if (selectedValue === 'id_choice') {
      data.sort(function (a, b) {
        return parseInt(a.invoiceid) - parseInt(b.invoiceid);
      });
    } else if (selectedValue === 'id_date') {
      data.sort(function (a, b) {
        var dateA = new Date(a.upload_date);
        var dateB = new Date(b.upload_date);
        return dateB - dateA;
      });
    } else if (selectedValue === "id_name") {
      data.sort(function (a, b) {
        return a.invoice_name.localeCompare(b.invoice_name);
      });
    } else if (selectedValue === 'id_amount') {
      data.sort(function (a, b) {
        return parseInt(a.total) - parseInt(b.total);
      });
    }

    // Render the sorted data
    renderTable(data);
  });
}

function sort_asc() {
  getData().then(data => {
    var selectedValue = sortDropdown.value;

    if (selectedValue === 'id_choice') {
      data.sort(function (a, b) {
        return parseInt(b.invoiceid) - parseInt(a.invoiceid);
      });
    } else if (selectedValue === 'id_date') {
      data.sort(function (a, b) {
        var dateA = new Date(a.upload_date);
        var dateB = new Date(b.upload_date);
        return dateA - dateB;
      });
    } else if (selectedValue === "id_name") {
      data.sort(function (a, b) {
        return b.invoice_name.localeCompare(a.invoice_name);
      });
    } else if (selectedValue === 'id_amount') {
      data.sort(function (a, b) {
        return parseInt(b.total) - parseInt(a.total);
      });
    }
    // Render the sorted data
    renderTable(data);
  });
}

function openImage(value) {
  window.open('http://127.0.0.1:8080/' + value)
}

function openText(value) {
  const newURL = `http://localhost:8000/invoice/get-detected-text/${value}`;
  window.open(newURL);
}


// Function to convert detected texts to CSV format
function convertToCSV(detectedTexts) {
  // Initialize an array to store the CSV rows
  const csvRows = [];

  // Push the CSV header as the first row
  csvRows.push('"Name","Telephone","Total","IssuedDate","Table Data"');

  // Extract the extractedDetails from the object
  const { extractedDetails } = detectedTexts;

  // Extract the relevant data from the extractedDetails
  const name = extractedDetails.Name.join(', ');
  const telephone = extractedDetails.Telephone.join(', ');
  const total = extractedDetails.Total.join(', ');
  const issuedDate = extractedDetails.IssuedDate.join(', ');

  // Combine the rows for table_data into a single string
  const tableData = detectedTexts.table_data.map(row => row[0]).join('\n');

  // Combine the extracted data and table data into a single CSV row
  const csvRow = `"${name}","${telephone}","${total}","${issuedDate}","${tableData}"`;

  // Push the CSV row to the array
  csvRows.push(csvRow);

  // Join the rows using newline characters to form the complete CSV content
  const csvContent = csvRows.join('\n');

  return csvContent;
}


// Function which exports detected texts to CSV and downloads the file
function exportToCSV(invoiceid) {
  fetch(`/invoice/get-detected-text/${invoiceid}`, {
    method: "GET",
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Network response was not ok. Status: ${response.status} - ${response.statusText}`);
      }
      return response.json();
    })
    .then(detectedTexts => {
      const csvContent = convertToCSV(detectedTexts);
      downloadCSV(csvContent, `invoice_data_${invoiceid}.csv`);
    })
    .catch(error => console.error("Error fetching data:", error));
}

function downloadCSV(csvContent, fileName) {
  // this function helps to download the CSV content as a file
  // created a Blob and set it as the download link href
  const csvBlob = new Blob([csvContent], { type: "text/csv" });
  const csvUrl = URL.createObjectURL(csvBlob);

  const downloadLink = document.createElement("a");
  downloadLink.setAttribute("href", csvUrl);
  downloadLink.setAttribute("download", fileName);
  downloadLink.style.display = "none";

  document.body.appendChild(downloadLink);
  downloadLink.click();

  document.body.removeChild(downloadLink);
}
