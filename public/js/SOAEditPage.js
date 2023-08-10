
document.addEventListener('DOMContentLoaded', basicSetup());

function basicSetup(){
    var urlParams = new URLSearchParams(window.location.search);
    const path = urlParams.get('path');
    const invoiceId = urlParams.get('invoiceId');
    const invoiceStatus = urlParams.get('invoiceStatus').toUpperCase();
    const invoiceName = urlParams.get('invoiceName');
    const invoiceDate = urlParams.get('invoiceDate');
    const invoiceAmount = urlParams.get('invoiceAmount');
    const invoices = urlParams.get('invoices');

    // get the elements
    const path_hidden = document.getElementById('path_hidden');
    const inp_id = document.getElementById('inp_id');
    const inp_total_status = document.getElementById('inp_status');
    const inp_comp_name = document.getElementById('inp_comp_name');
    const inp_issue_date = document.getElementById('inp_issue_date');
    const inp_total_amount = document.getElementById('inp_total_amount');
    const inp_invoices = document.getElementById('inp_invoices');

    // set the values
    path_hidden.value = path;
    inp_id.value = invoiceId;
    inp_total_status.value = invoiceStatus;
    inp_comp_name.value = invoiceName;
    console.log(invoiceDate);
    const date = new Date(invoiceDate);
    // Format the date to "mm/dd/yyyy" format
    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    console.log(formattedDate);
    inp_issue_date.value = formattedDate;
    inp_total_amount.value = invoiceAmount;
    inp_invoices.value = invoices
    console.log("invoicelist", invoices);

    // make things unchangeable
    inp_total_status.setAttribute('readonly', true);
    
    var statusColor = "";
    if (invoiceStatus === "DRAFT") {
        statusColor = "#acacac";
    } else if (invoiceStatus === "OVERDUE") {
        statusColor = "rgb(252, 183, 137)";
    } else if (invoiceStatus === "PAID") {
        statusColor = "rgb(136, 197, 136)";
    }
    
    inp_status.style.backgroundColor = statusColor;
}

// function convertToMySQLDateFormat(dateString) {
//     // Split the date string by '/'
//     const dateComponents = dateString.split('/');
  
//     // Extract day, month, and year components
//     const day = parseInt(dateComponents[0], 10);
//     const month = parseInt(dateComponents[1], 10);
//     const year = parseInt(dateComponents[2], 10);
  
//     // Create a new Date object with Singapore's time zone (Asia/Singapore)
//     const dateObject = new Date(Date.UTC(year, month - 1, day, 0, 0, 0));
  
//     // Format the date object into a string with 'YYYY-MM-DD' format
//     console.log("date in soa",dateObject.toISOString);
//     const mysqlDateFormat = dateObject.toISOString().slice(0, 10);
  
//     return mysqlDateFormat;
//   }  


  document.getElementById("btn_edit_update_container").addEventListener("click", function () {
    // Get the input elements
    const inp_comp_name = document.getElementById("inp_comp_name").value;
    const inp_issue_date = document.getElementById("inp_issue_date").value;
    // const inp_issue_date_sql = convertToMySQLDateFormat(inp_issue_date);
    const inp_total_amount = document.getElementById("inp_total_amount").value; //need to show it has limit
    const invoiceId = document.getElementById('inp_id').value;
    const path = document.getElementById('path_hidden').value;
    const invoices = document.getElementById('inp_invoices').value;

    // Validate date format (dd/mm/yyyy)
    // const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    // // Split the date string by '/'
    // const dateComponents = inp_issue_date.split('/');
    // // Extract day, month, and year components
    // const day = parseInt(dateComponents[0], 10);
    // const month = parseInt(dateComponents[1], 10);
    // if (!dateRegex.test(inp_issue_date)) {
    //     document.getElementById("error_msg").textContent = "Invalid date format (dd/mm/yyyy)";
    //     return;
    // } else if (day > 31 || month > 12) {
    //     document.getElementById("error_msg").textContent = "Invalid day or month in the date string";
    //     return ;
    // }
    // else{
    //     document.getElementById("error_msg").textContent = ""
    // }

    // Validate amount as float
    const amountRegex = /^\d+(\.\d{1,2})?$/;
    if (!amountRegex.test(inp_total_amount)) {
        document.getElementById("error_msg").textContent = "Invalid amount format (e.g., 123.45)";
        return;
    } else{
        document.getElementById("error_msg").textContent = ""
    }
  
    // // You can use the input values for further processing, like updating data on the server, etc.
    fetch('/invoice/update_data_soa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          invoice_name:inp_comp_name,
          upload_date:inp_issue_date,
          total: inp_total_amount,
          invoiceid:invoiceId,
          soa_invoice:invoices,
          path: path,
        })
      })
      .then(data => {
        console.log('Server response:', data);
        window.location.href = 'SOAPage.html';
      })
      .catch(error => {
        console.error('Error updating data:', error);
      });
  });