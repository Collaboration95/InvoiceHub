/* CODE FOR RENDERING THE TABLE */

var table = document.getElementById("invoice_preview_table");

// Function to fetch data from the server
function getData() {
  return fetch('/invoice/table')
    .then(response => response.json())
    .then(data => {
      return data;
    })
    .catch(error => {
      console.error('Error fetching invoices data:', error);
    });
}

// Function to render the table with data
function renderTable(data) {
  // set up the title of each column
  table.innerHTML = `
    <tr>
      <th>NO.</th>
      <th>ITEM CODE</th>
      <th>DESCRIPTION</th>
      <th>ORDER QTY</th>
      <th>UOM</th>
      <th>UNIT PRICE</th>
      <th>AMT (S$)</th>
    </tr>
  `;

  // Render each row of data
  data.forEach(invoice => {
    invoice.upload_date = new Date(invoice.upload_date);
        const options = { timeZone: 'Asia/Singapore' };
        invoice.upload_date = (invoice.upload_date).toLocaleDateString('en-SG', options);

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


/* CODE FOR THE SEARCHING FUNCTION */

// empty array for saving searched result
var searched = [];

// get the input for searching and dropdown
var input = document.getElementById("inp_search_blank");
var searchDropdown = document.getElementById("search_type_dropdown");

// code for searching and filter based on it
input.addEventListener("keyup", function() {
  var searchInput = this.value.toLowerCase();
  var filterValue = searchDropdown.value;

  getData().then(data => {

    // convert all saved data into lower case for easy searching
    searched = data.filter(function(val) {
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

/* SORTING WITH DROPDOWN */

function sort_des() {
  getData().then(data => {
    var selectedValue = sortDropdown.value;

    if (selectedValue === 'id_choice') {
      data.sort(function(a, b) {
        return parseInt(a.invoiceid) - parseInt(b.invoiceid);
      });
    } else if (selectedValue === 'id_date') {
      data.sort(function(a, b) {
        var dateA = new Date(a.upload_date);
        var dateB = new Date(b.upload_date);
        return dateB - dateA;
      });
    } else if (selectedValue === "id_name") {
      data.sort(function(a, b) {
        return a.invoice_name.localeCompare(b.invoice_name);
      });
    } else if (selectedValue === 'id_amount') {
      data.sort(function(a, b) {
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
      data.sort(function(a, b) {
        return parseInt(b.invoiceid) - parseInt(a.invoiceid);
      });
    } else if (selectedValue === 'id_date') {
      data.sort(function(a, b) {
        var dateA = new Date(a.upload_date);
        var dateB = new Date(b.upload_date);
        return dateA - dateB;
      });
    } else if (selectedValue === "id_name") {
      data.sort(function(a, b) {
        return b.invoice_name.localeCompare(a.invoice_name);
      });
    } else if (selectedValue === 'id_amount') {
      data.sort(function(a, b) {
        return parseInt(b.total) - parseInt(a.total);
      });
    }

    // Render the sorted data
    renderTable(data);
  });
}
