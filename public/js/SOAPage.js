//final checked by ramita and radhi (11/08)
var table = document.getElementById("soa_table");
 
const invoice ={};
let soaData;
let data;

// Function to fetch data from the server
async function getData() {
    try {
      const response = await fetch('/invoice/all-soa');
      const data = await response.json();
      console.log('Data from server:', data); // Add this log
      return data;
    } catch (error) {
      console.error('Error fetching soa data:', error);
      return [];
    }
  }
  async function getsoaData() {
    try {
      const response = await fetch('/payment/get-soa-invoice');
      const data = await response.json();
      console.log('Data from server:', data); // Add this log
      return data;
    } catch (error) {
      console.error('Error fetching soa data:', error);
      return [];
    }
  }
  async function updatesoa(data){
    data.forEach(async soa =>{
      const extractedCodes = [];
      const firstWord = soa.table_data.replace(/[\[\]'"`]/g, '').split(",");
      for (let i = 0; i < firstWord.length; i++) {
        const currentItem = firstWord[i].trimLeft().split(" ");
        item = currentItem[0];
        extractedCodes.push(item);
    }
    extracted = extractedCodes.toString();
    console.log(extracted);
    if (soa.soa_invoice == null){
      try {
        const response = await fetch(`../payment/update-soa`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ soa: extracted, path: soa.path }),
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
    }
    })
    
  }

  

// Function to render the table with data
function renderTable(data) {
  // set up the title of each column
  table.innerHTML = `
    <tr>
      <th>ID</th>
      <th>COMPANY NAME</th>
      <th>INVOICES</th>
      <th>SOA DATE</th>
      <th>AMOUNT</th>
      <th>STATUS</th>
      <th>ACTION</th>
    </tr>
  `;
  // Render each row of data
  data.forEach(soa => {
         soa.upload_date = new Date(soa.upload_date);
        const options = { timeZone: 'Asia/Singapore' };
        soa.upload_date = (soa.upload_date).toLocaleDateString('en-SG', options);

        var previewIcon =  `
        <a href="#">
          <svg xmlns="http://www.w3.org/2000/svg"  onclick="openImage(this.getAttribute('value'))" value='${soa.path}' width="16" height="16" fill="currentColor" class="bi bi-eye" viewBox="0 0 16 16">
            <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
            <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
          </svg>
        </a>`
        var editIcon = `
        <a href="#">
        <svg class="ic_edit" path="${soa.path}" id="${soa.invoiceid}" status="${soa.status}" name="${soa.invoice_name}" date="${soa.upload_date}" amount="${soa.total}" invoices="${soa.soa_invoice}" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16">
            <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
          </svg>
        </a>`;
        var deleteIcon = `
        <svg class="ic_delete" id="${soa.invoiceid}" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
            <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"/>
          </svg>`;

        var paymentIcon = `
          <a href="#">
          <svg class="ic_payment" id="${soa.invoiceid}" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-cash-coin" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M11 15a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm5-4a5 5 0 1 1-10 0 5 5 0 0 1 10 0z"/>
          <path d="M9.438 11.944c.047.596.518 1.06 1.363 1.116v.44h.375v-.443c.875-.061 1.386-.529 1.386-1.207 0-.618-.39-.936-1.09-1.1l-.296-.07v-1.2c.376.043.614.248.671.532h.658c-.047-.575-.54-1.024-1.329-1.073V8.5h-.375v.45c-.747.073-1.255.522-1.255 1.158 0 .562.378.92 1.007 1.066l.248.061v1.272c-.384-.058-.639-.27-.696-.563h-.668zm1.36-1.354c-.369-.085-.569-.26-.569-.522 0-.294.216-.514.572-.578v1.1h-.003zm.432.746c.449.104.655.272.655.569 0 .339-.257.571-.709.614v-1.195l.054.012z"/>
          <path d="M1 0a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h4.083c.058-.344.145-.678.258-1H3a2 2 0 0 0-2-2V3a2 2 0 0 0 2-2h10a2 2 0 0 0 2 2v3.528c.38.34.717.728 1 1.154V1a1 1 0 0 0-1-1H1z"/>
          <path d="M9.998 5.083 10 5a2 2 0 1 0-3.132 1.65 5.982 5.982 0 0 1 3.13-1.567z"/>
        </svg>
          </a>`;

        // var for saving the status' color column
        var statusColor = "";
        var status = soa.status.toUpperCase();

        // classify the color for each status
        if (status === "DRAFT") {
          statusColor = "#acacac";
        } else if (status === "OVERDUE") {
          console.log("not correct");
          statusColor = "rgb(252, 183, 137)";
        } else if (status === "PAID") {
          statusColor = "rgb(136, 197, 136)";
        } else if (status === "UNPAID"){
        }

        invoice[soa.invoiceid]=soa.soa_invoice;

        // render each row of data
        table.innerHTML += `
          <tr>
            <td>${soa.invoiceid}</td>
            <td>${soa.invoice_name}</td>
            <td>${soa.soa_invoice}</td>
            <td>${soa.upload_date}</td>
            <td>$S ${soa.total}</td>
            <td style="background-color: ${statusColor};" data-status="${status}" data-invoice-id="${soa.invoiceid}">${status}</td>
            <td>${previewIcon} ${editIcon} ${deleteIcon} ${paymentIcon}</td>
          </tr>`;
        
  });

}


document.addEventListener('DOMContentLoaded', init);

async function init() {
  try {
    soaData = await getsoaData(); // Retrieve data from the server
    console.log("soadata", soaData.table_data);
    await updatesoa(soaData);
    data = await getData();
    console.log(data);
    renderTable(data);// Display the data in the table
    updateTotalDue();
    updateTotalOutstanding();
    updateTotalOverdue();

  } catch (error) {
    // Handle any errors that occur during data retrieval
    console.error('Error initializing page:', error);
  }
}



// // Add event listener for delete icon using event delegation
table.addEventListener("click", function (event) {
  console.log("click");
  // if (event.target.classList.contains("ic_payment")) {
    if (true) {
    console.log("click payment");
    // Retrieve the invoice id from the data attribute
    var soaId = event.target.getAttribute("id");
    if (soaId != null ) {
      // Encode the selected invoice IDs as a query parameter
      var queryParams = new URLSearchParams();
      console.log(invoice[soaId]);
      queryParams.append("SOA", soaId);
      queryParams.append("Invoice", invoice[soaId]);
  
      // Build the URL for the next page with the query parameter
      var nextPageURL = "SOAPaymentForm.html?" + queryParams.toString();
  
      // Navigate to the next page
      window.location.href = nextPageURL;
    }
  }

  if (event.target.classList.contains("ic_edit")) {
    console.log("edit");
    var path = event.target.getAttribute("path");
    var invoiceId = event.target.getAttribute("id");
    var invoiceStatus = event.target.getAttribute("status");
    var invoiceName = event.target.getAttribute("name");
    var invoiceDate = event.target.getAttribute("date");
    var invoiceAmount = event.target.getAttribute("amount");
    var invoices = event.target.getAttribute("invoices");
    console.log(invoiceAmount,invoiceId);
    var queryParams = new URLSearchParams();
    queryParams.append('path', path);
    queryParams.append('invoiceId', invoiceId);
    queryParams.append('invoiceStatus', invoiceStatus);
    queryParams.append('invoiceName', invoiceName);
    queryParams.append('invoiceDate', invoiceDate);
    queryParams.append('invoiceAmount', invoiceAmount);
    queryParams.append('invoices', invoices);
    console.log(invoices);
    var nextPageURL = "SOAEditPage.html?" + queryParams.toString();
    window.location.href = nextPageURL;

  }

  if (event.target.classList.contains("ic_delete")) {
    // Retrieve the invoice id from the data attribute
    var soaId = event.target.getAttribute("id");

    // Show a confirmation popup
    var confirmed = confirm("Are you sure you want to delete this SOA?");

    if (confirmed) {
      fetch('/invoice/invoiceid',{
        method: "DELETE",
        headers: {
          'Content-type': 'application/json',
        },
        body:JSON.stringify({invoiceid: (soaId)}),
      });
    }
    getData().then(data => renderTable(data));
    location.reload();
  }

});

// Add event listener to the table for status cells
table.addEventListener("click", function(event) {
  const targetCell = event.target;
  // Check if the clicked cell is a status cell and the status is "PAID"
  if (targetCell.tagName === "TD" && targetCell.dataset.status === "PAID") {
    const invoiceId = targetCell.dataset.invoiceId;
    console.log("invoiceID", invoiceId);
    if (invoiceId) {
      
      // Build the URL for the next page with the invoice number as a query parameter
      var queryParams = new URLSearchParams();
      queryParams.append("invoiceId", null);
      queryParams.append("SOA", invoiceId );

      // Replace "NextPage.html" with the actual name of your next page
      var nextPageURL = "Paid.html?" + queryParams.toString();

      // Redirect to the next page
      window.location.href = nextPageURL;
    }

  }
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
      console.log(val);
      var id = val.invoiceid.toString().toLowerCase();
      var name = val.invoice_name.toLowerCase();
      val.upload_date = new Date(val.upload_date);
      const options = { timeZone: 'Asia/Singapore' };
      var upload_date = (val.upload_date).toLocaleDateString('en-SG', options);
      var date = upload_date.toLowerCase();
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

searchDropdown.addEventListener('change', function() {
  input.value = '';
  getData().then(data => renderTable(data)); 
});

/* CODE FOR SORT/ SORTING FUNCTION */

/* SORTING WITH DROPDOWN */

// get the dropdown
var sortDropdown = document.getElementById('sort_dropdown');
var ascendingButton = document.getElementById('ic_sort_asc');
var descendingButton = document.getElementById('ic_sort_des');

ascendingButton.addEventListener('click', function() {
  if (searched.length === 0) {
    sort_asc();
  } else {
    sort_asc();
  }
});

descendingButton.addEventListener('click', function() {
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
      data.sort(function(a, b) {
        return parseInt(b.soa_number) - parseInt(a.soa_number);
      });
    } else if (selectedValue === 'id_date') {
      data.sort(function(a, b) {
        var dateA = new Date(a.upload_date);
        var dateB = new Date(b.upload_date);
        return dateA - dateB;
      });
    } else if (selectedValue === "id_name") {
      data.sort(function(a, b) {
        return b.company_name.localeCompare(a.company_name);
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

function openImage(value){
  window.open('http://127.0.0.1:8080/img-db/'+value)
  }
  
  function openText(value){
      const newURL = `http://localhost:8000/invoice/get-detected-text/${value}`;
          window.open(newURL);
  }
  


function updateTotalOutstanding() {
  fetch("/homepage/fetch-total-outstanding-soa")
      .then(response => response.text())
      .then(data => {
        console.log(data);
          document.getElementById("total_value").textContent = data;
      })
      .catch(error => {
          console.error("Error fetching data:", error);
          document.getElementById("total_value").textContent = "Error loading data";
      });
}
function updateTotalDue() {
  fetch("/homepage/fetch-total-due-soa")
      .then(response => response.text())
      .then(data => {
        console.log(data);
          document.getElementById("total_due_value").textContent = data;
      })
      .catch(error => {
          console.error("Error fetching data:", error);
          document.getElementById("total_due_value").textContent = "Error loading data";
      });
}

function updateTotalOverdue() {
  fetch("/homepage/fetch-total-overdue-soa")
      .then(response => response.text())
      .then(data => {
        console.log(data);
          document.getElementById("total_overdue_value").textContent = data;
      })
      .catch(error => {
          console.error("Error fetching data:", error);
          document.getElementById("total_overdue_value").textContent = "Error loading data";
      });
}

