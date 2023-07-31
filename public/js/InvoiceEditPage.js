basicSetup();

function basicSetup(){
    // get the data from the local storage
    const invoiceId = localStorage.getItem('invoiceId');
    const invoiceStatus = localStorage.getItem('invoiceStatus').toUpperCase();
    const invoiceName = localStorage.getItem('invoiceName');
    const invoiceDate = localStorage.getItem('invoiceDate');
    const invoiceAmount = localStorage.getItem('invoiceAmount');

    // get the elements
    const inp_id = document.getElementById('inp_id');
    const inp_total_status = document.getElementById('inp_status');
    const inp_comp_name = document.getElementById('inp_comp_name');
    const inp_issue_date = document.getElementById('inp_issue_date');
    const inp_total_amount = document.getElementById('inp_total_amount');

    // set the values
    inp_id.value = invoiceId;
    inp_total_status.value = invoiceStatus;
    inp_comp_name.value = invoiceName;
    inp_issue_date.value = invoiceDate;
    inp_total_amount.value = invoiceAmount;

    // make things unchangeable
    inp_id.setAttribute('readonly', true);
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


document.getElementById("btn_edit_update_container").addEventListener("click", function () {
    // Get the input elements
    const inp_comp_name = document.getElementById("inp_comp_name").value;
    const inp_issue_date = document.getElementById("inp_issue_date").value;
    const inp_total_amount = document.getElementById("inp_total_amount").value; 
    const inp_phone_no = document.getElementById("inp_phone_no").value; 
  
    // Perform the necessary actions with the input values
    console.log(inp_comp_name);
    console.log(inp_issue_date);
    console.log(inp_total_amount);
    console.log(inp_phone_no);

    // Validate date format (dd/mm/yyyy)
    const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!dateRegex.test(inp_issue_date)) {
        document.getElementById("error_msg").textContent = "Invalid date format (dd/mm/yyyy)";
        return;
    }
    else{
        document.getElementById("error_msg").textContent = ""
    }

    // Validate amount as float
    const amountRegex = /^\d+(\.\d{1,2})?$/;
    if (!amountRegex.test(inp_total_amount)) {
        document.getElementById("error_msg").textContent = "Invalid amount format (e.g., 123.45)";
        return;
    }
    else{
        document.getElementById("error_msg").textContent = ""
    }

    // Validate phone number format (contains only numbers)
    const phoneNumberRegex = /^\d+$/;
    if (!phoneNumberRegex.test(inp_phone_no)) {
        document.getElementById("error_msg").textContent = "Invalid phone number format (should contain only numbers)";
        return;
    }
    else{
        document.getElementById("error_msg").textContent = ""
    }
  
    // // You can use the input values for further processing, like updating data on the server, etc.
    // fetch('/update_data', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({
    //     input1: input1Value,
    //     input2: input2Value
    //   })
    // })
    // .then(response => response.json())
    // .then(data => {
    //   console.log('Server response:', data);
    //   // You can update the UI or perform other actions based on the server response.
    // })
    // .catch(error => {
    //   console.error('Error updating data:', error);
    //   // Handle the error appropriately.
    // });
  });
  