const manage = document.getElementById('manage-btn');

var imageUpload = document.getElementById('template');
var previewImage = document.getElementById('previewImage');
const previewButton = document.getElementById('previewButton');
let file;
const reader = new FileReader();

var nameInput = document.getElementById('name');
var emailInput = document.getElementById('email');
var phoneInput = document.getElementById('phone');
var itemsInput = document.getElementById('csvFile');
const submit = document.getElementById('submit');

var table = document.getElementById('supplier-table');
let supplier_data = []; 

var suppliers = 0;
var code = 0;

function addSupplier() {
  suppliers += 1;
}

function SupplierCode(){
    code = suppliers;
    if (code<10){
        code = "00"+code;
    }
    if (code<100){
        code = "0"+code;
    }
    else code=code.toString();
}

imageUpload.addEventListener('change', function() {
    const file = imageUpload.files[0];
    reader.onload = function(e) {
      
      //previewImage.style.display = 'block';
      previewButton.style.display = 'inline-block';
      previewButton.dataset.imageSrc = reader.result;
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  });

  previewButton.addEventListener('click', function(event) {
    // Handle the preview button click event
    event.preventDefault()
    const imageSrc = previewButton.dataset.imageSrc;
    previewImage.src = imageSrc;
    previewImage.style.display = 'block';
    console.log('Preview button clicked!');

    if (file) {
        reader.readAsDataURL(file);
      }
  });

function validateForm() {
    const emailError = document.getElementById('emailError');
    const phoneError = document.getElementById('phoneError');
    
    if (!emailInput.checkValidity()) {
      emailError.style.display = 'block';        
    }
    else if (!phoneInput.checkValidity()) {
        phoneError.style.display = 'block';
    }
    else {
      // Proceed with form submission or further processing
      addSupplier();
      saveData();
    }
    
  } 

submit.addEventListener('click', function(event) {
    validateForm();
    console.log('submit clicked');
    

})

function saveData() {
    data = {
      code: SupplierCode(),
      name: nameInput.value,
      email: emailInput.value,
      phone: phoneInput.value
    }; 
    supplier_data.push(data);
  // const csvFile = csvFileUpload.files[0];
  //  if (csvFile) {
    //  data.csvFileName = csvFile.name;
    //}
  
//    const imageFile = imageUpload.files[0];
  //  if (imageFile) {
    //  data.imageFileName = imageFile.name;
      //data.imageSrc = previewButton.dataset.imageSrc;
  //  } 
    
  localStorage.setItem('supplierData', JSON.stringify(supplier_data));
  console.log(supplier_data);
  }
  
function loadData(data) {
  const supplierData = JSON.parse(localStorage.getItem('supplierData'));

   if (supplierData) {
    table.innerHTML = ''; // Clear any existing data in the table

    for (const data of supplierData) {
      const row = table.insertRow();

      const cellCode = row.insertCell();
      cellCode.textContent = data.code;

      const cellName = row.insertCell();
      cellName.textContent = data.name;

      const cellEmail = row.insertCell();
      cellEmail.textContent = data.email;

      const cellPhone = row.insertCell();
      cellPhone.textContent = data.phone;
  }}}

  function table_display(){
    table.style.display = 'block';

    const Load_data = JSON.parse(localStorage.getItem('supplierData'));
    if (load_data.length > 2 ){
      loadData();       
      }
    // if less than 3 suppliers, then add blank rows to the table

    else {
        loadData();
        
        for (var i = 0; i < 3 - length(load_data); i++){
            // Create a new blank row element
          const newRow = table.insertRow();
    }}}
  
  // manage.addEventListener('click', table_display);

  function clearTable(table) {
    var firstRow = table.rows[0];
    var tBody = table.tBodies[0].cloneNode(false);
    tBody.appendChild(firstRow);
    table.replaceChild(tBody, table.tBodies[0]);
  }

  function disableAutocomplete() {
    var form = document.getElementById('yourFormId'); // Replace 'yourFormId' with the actual ID of your form
    form.setAttribute('autocomplete', 'off');
  }
  
  
  // Call the function to load saved data when the page loads
  //  window.addEventListener('load', loadData);


  // issues: 
  // 1. when the page loads, the table is not displayed
  // 2. when Submit is clicked, data is not displayed on console. x

