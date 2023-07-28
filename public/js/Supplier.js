require('dotenv').config(); // Load environment variables from .env file
const manage = document.getElementById('manage-btn');
var imageUpload = document.getElementById('template');
var previewImage = document.getElementById('previewImage');
const previewButton = document.getElementById('previewButton');
let file;
const reader = new FileReader();

var nameInput = document.getElementById('name');
var emailInput = document.getElementById('email');
var phoneInput = document.getElementById('phone');
const submit = document.getElementById('submit');

var table = document.getElementById('supplier-table');

//db

const mysql = require('mysql2/promise');


function SupplierCode() {
  let code = suppliers;
  if (code < 10) {
    code = "00" + code;
  } else if (code < 100) {
    code = "0" + code;
  } else {
    code = code.toString();
  }
  return code;
}

imageUpload.addEventListener('change', function () {
  const file = imageUpload.files[0];
  reader.onload = function (e) {
    previewButton.style.display = 'inline-block';
    previewButton.dataset.imageSrc = reader.result;
  };

  if (file) {
    reader.readAsDataURL(file);
  }
});

previewButton.addEventListener('click', function (event) {
  event.preventDefault()
  const imageSrc = previewButton.dataset.imageSrc;
  previewImage.src = imageSrc;
  previewImage.style.display = 'block';
});

submit.addEventListener('click', function (event) {
  validateForm();
  event.preventDefault();
  const entry = event.target;
  console.log('submit clicked');
})

function validateForm() {
  const emailError = document.getElementById('emailError');
  const phoneError = document.getElementById('phoneError');

  if (!emailInput.checkValidity()) {
    emailError.style.display = 'block';
  } else if (!phoneInput.checkValidity()) {
    phoneError.style.display = 'block';
  } else {
    // Proceed with form submission or further processing
    addSupplier();
    saveData();
    console.log("successfully submitted");
  }
}

async function saveData() {
  const data = {
    code: SupplierCode(),
    name: nameInput.value,
    email: emailInput.value,
    //phone: phoneInput.value
  };

  if (data.phone) {
    const phoneNumber = parseInt(data.phone, 10); // Parse the input as an integer
    if (isNaN(phoneNumber)) {
      console.error('Error: Phone number must be an integer.');
      return; // Exit the function if the phone number is not an integer
    }
    // Update the data object with the parsed integer
    data.phone = phoneNumber;
  }

  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    });

    await connection.query(
      `INSERT INTO supplier (code, name, email, phone) VALUES (?, ?, ?, ?);`,
      [data.code, data.name, data.email, data.phone]
    );

    console.log('Data saved to SQL database successfully!');
    connection.end();
  } catch (err) {
    console.error('Error saving data to SQL database:', err);
  }

  const csvFile = itemsInput.files[0];
  require('dotenv').config(); // Load environment variables from .env file
  const manage = document.getElementById('manage-btn');
  var imageUpload = document.getElementById('template');
  var previewImage = document.getElementById('previewImage');
  const previewButton = document.getElementById('previewButton');
  let file;
  const reader = new FileReader();
  
  var nameInput = document.getElementById('name');
  var emailInput = document.getElementById('email');
  var phoneInput = document.getElementById('phone');
  const submit = document.getElementById('submit');
  
  var table = document.getElementById('supplier-table');
  
  //db
  
  const mysql = require('mysql2/promise');
  require('dotenv').config();
  
  function SupplierCode() {
    let code = suppliers;
    if (code < 10) {
      code = "00" + code;
    } else if (code < 100) {
      code = "0" + code;
    } else {
      code = code.toString();
    }
    return code;
  }
  
  imageUpload.addEventListener('change', function () {
    const file = imageUpload.files[0];
    reader.onload = function (e) {
      previewButton.style.display = 'inline-block';
      previewButton.dataset.imageSrc = reader.result;
    };
  
    if (file) {
      reader.readAsDataURL(file);
    }
  });
  
  previewButton.addEventListener('click', function (event) {
    event.preventDefault()
    const imageSrc = previewButton.dataset.imageSrc;
    previewImage.src = imageSrc;
    previewImage.style.display = 'block';
  });
  
  submit.addEventListener('click', function (event) {
    validateForm();
    event.preventDefault();
    const entry = event.target;
    console.log('submit clicked');
  })
  
  function validateForm() {
    const emailError = document.getElementById('emailError');
    const phoneError = document.getElementById('phoneError');
  
    if (!emailInput.checkValidity()) {
      emailError.style.display = 'block';
    } else if (!phoneInput.checkValidity()) {
      phoneError.style.display = 'block';
    } else {
      // Proceed with form submission or further processing
      addSupplier();
      saveData();
      console.log("successfully submitted");
    }
  }
  
  async function saveData() {
    const data = {
      code: SupplierCode(),
      name: nameInput.value,
      email: emailInput.value,
      //phone: phoneInput.value
    };
  
    if (data.phone) {
      const phoneNumber = parseInt(data.phone, 10); // Parse the input as an integer
      if (isNaN(phoneNumber)) {
        console.error('Error: Phone number must be an integer.');
        return; // Exit the function if the phone number is not an integer
      }
      // Update the data object with the parsed integer
      data.phone = phoneNumber;
    }
  
    try {
      const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
      });
  
      await connection.query(
        `INSERT INTO supplier (code, name, email, phone) VALUES (?, ?, ?, ?);`,
        [data.code, data.name, data.email, data.phone]
      );
  
      console.log('Data saved to SQL database successfully!');
      connection.end();
    } catch (err) {
      console.error('Error saving data to SQL database:', err);
    }
  
    const csvFile = itemsInput.files[0];
        if (csvFile) {
          const reader = new FileReader();
          reader.onload = async function (event) {
            const csvContents = event.target.result;
            data.csv_data = csvContents;
  
            try {
              const connection = await mysql.createConnection({
                host: process.env.DB_HOST,
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_DATABASE,
              });
  
              await connection.query(
                `INSERT INTO supplier (name, email, phone, csv_data) VALUES (?, ?, ?, ?);`,
                [data.name, data.email, data.phone, data.csv_data]
              );
  
              console.log('Data saved to SQL database successfully!');
              connection.end();
            } catch (err) {
              console.error('Error saving data to SQL database:', err);
            }
          };
  
          reader.readAsText(csvFile);
        } else {
          // If no CSV file is selected, proceed to save other form data
          try {
            const connection = await mysql.createConnection({
              host: process.env.DB_HOST,
              user: process.env.DB_USER,
              password: process.env.DB_PASSWORD,
              database: process.env.DB_DATABASE,
            });
  
            await connection.query(
              `INSERT INTO supplier (name, email, phone) VALUES (?, ?, ?);`,
              [data.name, data.email, data.phone]
            );
  
            console.log('Data saved to SQL database successfully!');
            connection.end();
          } catch (err) {
            console.error('Error saving data to SQL database:', err);
          }
        }
      
    // Optionally, you can reload the table to display the updated data
    loadData();
  }
  
  async function retrieveDataFromDB() {
    try {
      const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
      });
  
      // Fetch all rows from the "supplier" table
      const [rows, fields] = await connection.query('SELECT * FROM supplier');
  
      // Close the database connection
      connection.end();
  
      return rows;
    } catch (err) {
      console.error('Error retrieving data from the database:', err);
      return null; // Return null or handle the error as per your application's requirement
    }
  }
  
  // Function to load data into the table from the database
  async function loadData() {
    const supplierData = await retrieveDataFromDB();
  
    if (supplierData) {
      const tableBody = document.getElementById('supplier-table').getElementsByTagName('tbody')[0];
      tableBody.innerHTML = ''; // Clear any existing data in the table
  
      // Calculate the number of blank rows needed to fill up to 3 rows
      const blankRowCount = Math.max(3 - supplierData.length, 0);
  
      // Add data rows to the table
      for (const data of supplierData) {
        const row = tableBody.insertRow();
  
        const cellSelect = row.insertCell();
        cellSelect.innerHTML = '<button class="select-btn">Select</button>';
  
        const cellCode = row.insertCell();
        cellCode.textContent = data.code;
  
        const cellName = row.insertCell();
        cellName.textContent = data.name;
  
        const cellItemList = row.insertCell();
        cellItemList.textContent = 'View'; // Display "View" as the link text
        cellItemList.setAttribute('id', `item-list-${data.id}`); // Set the id attribute
  
        // Add an event listener to the "Item List" cell
        cellItemList.addEventListener('click', () => {
          // Retrieve the item list data for the selected supplier from the database
          // You need to implement the function to retrieve item list data based on the supplier ID
          const itemListData = getItemListData(data.id);
  
          // Open a new tab with the item list content
          const itemListTab = window.open('', '_blank');
          itemListTab.document.write(`<h1>Item List for ${data.name}</h1>`);
          // Render the item list data in the new tab
          // You can format it as needed, e.g., as an HTML table or a list
          itemListTab.document.write(`<p>${itemListData}</p>`);
          itemListTab.document.close();
        });
      }
  
      // Add blank rows to fill up to 3 rows
      for (let i = 0; i < blankRowCount; i++) {
        const row = tableBody.insertRow();
  
        const cellSelect = row.insertCell();
        cellSelect.innerHTML = '<button class="select-btn">Select</button>';
  
        const cellCode = row.insertCell();
        cellCode.textContent = '';
  
        const cellName = row.insertCell();
        cellName.textContent = '';
  
        const cellItemList = row.insertCell();
        cellItemList.textContent = '';
      }
    }
  }
  
  async function getItemListData(supplierId) {
    try {
      const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
      });
  
      // Fetch the CSV data from the "supplier" table based on the supplier ID
      const [rows, fields] = await connection.query(
        'SELECT csv_data FROM supplier WHERE id = ?',
        [supplierId]
      );
  
      // Close the database connection
      connection.end();
  
      if (rows.length > 0) {
        // Assuming the CSV data is in the first row of the result set
        const csvData = rows[0].csv_data;
  
        // Open a new tab with the item list content
        const itemListTab = window.open('', '_blank');
        itemListTab.document.write(`<h1>Item List for Supplier ID ${supplierId}</h1>`);
        // Render the CSV data in the new tab
        itemListTab.document.write(`<pre>${csvData}</pre>`); // Use <pre> tag for preformatted text
        itemListTab.document.close();
      } else {
        console.log(`No item list found for Supplier ID ${supplierId}.`);
      }
    } catch (err) {
      console.error('Error retrieving item list data from the database:', err);
    }
  }
  
  // Call the function to load data from the database when the page loads
  window.addEventListener('load', loadData);
  
}

async function retrieveDataFromDB() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    });

    // Fetch all rows from the "supplier" table
    const [rows, fields] = await connection.query('SELECT * FROM supplier');

    // Close the database connection
    connection.end();

    return rows;
  } catch (err) {
    console.error('Error retrieving data from the database:', err);
    return null; // Return null or handle the error as per your application's requirement
  }
}

// Function to load data into the table from the database
async function loadData() {
  const supplierData = await retrieveDataFromDB();

  if (supplierData) {
    const tableBody = document.getElementById('supplier-table').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = ''; // Clear any existing data in the table

    // Calculate the number of blank rows needed to fill up to 3 rows
    const blankRowCount = Math.max(3 - supplierData.length, 0);

    // Add data rows to the table
    for (const data of supplierData) {
      const row = tableBody.insertRow();

      const cellSelect = row.insertCell();
      cellSelect.innerHTML = '<button class="select-btn">Select</button>';

      const cellCode = row.insertCell();
      cellCode.textContent = data.code;

      const cellName = row.insertCell();
      cellName.textContent = data.name;

      const cellItemList = row.insertCell();
      cellItemList.textContent = 'View'; // Display "View" as the link text
      cellItemList.setAttribute('id', `item-list-${data.id}`); // Set the id attribute

      // Add an event listener to the "Item List" cell
      cellItemList.addEventListener('click', () => {
        // Retrieve the item list data for the selected supplier from the database
        // You need to implement the function to retrieve item list data based on the supplier ID
        const itemListData = getItemListData(data.id);

        // Open a new tab with the item list content
        const itemListTab = window.open('', '_blank');
        itemListTab.document.write(`<h1>Item List for ${data.name}</h1>`);
        // Render the item list data in the new tab
        // You can format it as needed, e.g., as an HTML table or a list
        itemListTab.document.write(`<p>${itemListData}</p>`);
        itemListTab.document.close();
      });
    }

    // Add blank rows to fill up to 3 rows
    for (let i = 0; i < blankRowCount; i++) {
      const row = tableBody.insertRow();

      const cellSelect = row.insertCell();
      cellSelect.innerHTML = '<button class="select-btn">Select</button>';

      const cellCode = row.insertCell();
      cellCode.textContent = '';

      const cellName = row.insertCell();
      cellName.textContent = '';

      const cellItemList = row.insertCell();
      cellItemList.textContent = '';
    }
  }
}

async function getItemListData(supplierId) {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    });

    // Fetch the CSV data from the "supplier" table based on the supplier ID
    const [rows, fields] = await connection.query(
      'SELECT csv_data FROM supplier WHERE id = ?',
      [supplierId]
    );

    // Close the database connection
    connection.end();

    if (rows.length > 0) {
      // Assuming the CSV data is in the first row of the result set
      const csvData = rows[0].csv_data;

      // Open a new tab with the item list content
      const itemListTab = window.open('', '_blank');
      itemListTab.document.write(`<h1>Item List for Supplier ID ${supplierId}</h1>`);
      // Render the CSV data in the new tab
      itemListTab.document.write(`<pre>${csvData}</pre>`); // Use <pre> tag for preformatted text
      itemListTab.document.close();
    } else {
      console.log(`No item list found for Supplier ID ${supplierId}.`);
    }
  } catch (err) {
    console.error('Error retrieving item list data from the database:', err);
  }
}

// Call the function to load data from the database when the page loads
window.addEventListener('load', loadData);
