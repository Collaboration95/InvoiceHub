const dropdownItems = [];
const testArray = [];
//var box = document.getElementById("notif-box");


async function retrieveData_overdue() {
  try {
    const response = await fetch('/notification/fetch-overdue-data'); // Fetch data 
    data = await response.json();
    return data;
  } catch (error) {
    console.error('Error retrieving data from the server:', error);
    throw error;
  }
}

async function retrieveData_3days() {
    try {
      const response = await fetch('/notification/fetch-3-days-data'); // Fetch data 
      data = await response.json();
      return data;
    } catch (error) {
      console.error('Error retrieving data from the server:', error);
      throw error;
    }
  }

  async function retrieveData_2days() {
    try {
      const response = await fetch('/notification/fetch-2-days-data'); // Fetch data 
      data = await response.json();
      return data;
    } catch (error) {
      console.error('Error retrieving data from the server:', error);
      throw error;
    }
  }

  async function retrieveData_1day() {
    try {
      const response = await fetch('/notification/fetch-1-days-data'); // Fetch data 
      data = await response.json();
      return data;
    } catch (error) {
      console.error('Error retrieving data from the server:', error);
      throw error;
    }
  }

  function add_overdue(data){
    data.forEach((invoice) => {
        //console.log(data);
        dropdownItems.push( "Invoice "+invoice.invoiceid+ " is overdue");
  });
  }

  function add_3days(data){
    data.forEach((invoice) => {
        
        dropdownItems.push("Invoice "+invoice.invoiceid+" is due in 3 days");
  });
  }

  function add_2days(data){
    data.forEach((invoice) => {
        
        dropdownItems.push("Invoice "+invoice.invoiceid+" is due in 2 days" );
  });
  }
  
  function add_1day(data){
    data.forEach((invoice) => {
        
        dropdownItems.push("Invoice "+invoice.invoiceid+" is due in 1 day");
  });
  }
  async function initDropdown() {
    data = await retrieveData_overdue();
    add_overdue(data);
    data3 = await retrieveData_3days();
    add_3days(data);
    data2 = await retrieveData_2days();
    add_2days(data);
    data1 = await retrieveData_1day();
    add_1day(data);

    const dropdownButton = document.querySelector('.dropdown-button');
    const dropdownContent = document.querySelector('.dropdown-content');

    // Items for the dropdown
    
    // Populate the dropdown content
      dropdownItems.forEach(function(itemText) {
      //temp.replaceChild();
      const item = document.createElement('div');
      item.className = 'dropdown-item';
      console.log(itemText);
      item.innerHTML = formatText(itemText);
      item.addEventListener('click', function() {
        // Extract the invoice ID from the item text and pass it to the redirection function
        const invoiceId = invoice.invoiceid;
        // Build the URL for the next page with the query parameter
        var nextPageURL = "PaymentForm.html?" + queryParams.toString();
        // Navigate to the next page
        window.location.href = nextPageURL;
      });

      dropdownContent.appendChild(item);
    });

  function formatText(text) {
  const formattedText = text
    //.replace('overdue', '<strong>OVERDUE</strong>')
    .replace(/\d+/g, '<strong>$&</strong>')
    .replace('Invoice', '<strong>Invoice</strong>');
    return formattedText;
    }

    // Toggle the visibility of the dropdown content when the button is clicked
    dropdownButton.addEventListener('click', function() {
      
      if (dropdownItems.length > 0){
      dropdownContent.style.display = dropdownContent.style.display === 'block' ? 'none' : 'block';
      }
      else {
        dropdownContent.textContent = "No notifications for now, check again later!";
        dropdownContent.style.display = dropdownContent.style.display === 'block' ? 'none' : 'block';

      }
    });

   // Close the dropdown when clicking outside of it
    document.addEventListener('click', function(event) {
      if (!dropdownButton.contains(event.target)) {
      dropdownContent.style.display = 'none';
   }
   });

  }

  // Call the initDropdown function when the page loads
  document.addEventListener('DOMContentLoaded', initDropdown);


