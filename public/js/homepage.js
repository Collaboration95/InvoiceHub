// const invoiceFileInput = document.getElementById('invoice-file');
// const icUploadIcon = document.querySelector('.ic_upload');

// icUploadIcon.addEventListener('click', function() {
//   // Trigger the file input click event programmatically
//   invoiceFileInput.click();
// });

// invoiceFileInput.addEventListener('change', function(event) {
//   // Handle the selected file
//   const file = event.target.files[0];
//   if (file) {
//     // Process the selected file here or initiate the file upload process
//     // For example, you can call a function to handle the file upload:
//     uploadFileToServer(file);
//   }
// });

// function uploadFileToServer(file) {
//   // You can implement the file upload process here
//   // Use the 'file' parameter to access the selected file and send it to the server
//   // For example, you can use the Fetch API to send the file in a POST request
//   const formData = new FormData();
//   formData.append('invoiceFile', file);

//   fetch('/upload', {
//     method: 'POST',
//     body: formData
//   })
//   .then(response => response.json())
//   .then(data => {
//     // Handle the response from the server after successful upload
//     console.log('File uploaded successfully:', data);
//   })
//   .catch(error => {
//     // Handle any errors that occur during the file upload process
//     console.error('Error uploading file:', error);
//   });
// }
