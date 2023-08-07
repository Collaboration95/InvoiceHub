const dropdownItems = [];

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
        dropdownItems.push( "Invoice "+invoice.invoiceid+ " of $"+ invoice.total+ " is overdue");
  });
  }

  function add_3days(data){
    data.forEach((invoice) => {
        
        dropdownItems.push("Invoice "+invoice.invoiceid+" of $"+ invoice.total+" is due in 3 days");
  });
  }

  function add_2days(data){
    data.forEach((invoice) => {
        
        dropdownItems.push("Invoice "+invoice.invoiceid+" of $"+invoice.total+" is due in 2 days" );
  });
  }
  
  function add_1day(data){
    data.forEach((invoice) => {
        
        dropdownItems.push("Invoice "+invoice.invoiceid+" of $"+invoice.total+" is due in a day");
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
      const item = document.createElement('div');
      item.className = 'dropdown-item';
      item.textContent = itemText;
      dropdownContent.appendChild(item);
    });

    // Toggle the visibility of the dropdown content when the button is clicked
    dropdownButton.addEventListener('click', function() {
      dropdownContent.style.display = dropdownContent.style.display === 'block' ? 'none' : 'block';
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