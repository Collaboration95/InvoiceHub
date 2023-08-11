//Final checked by ramita and radhi
const deleteAccountButton = document.getElementById('delete-account');
if (deleteAccountButton) {
  deleteAccountButton.addEventListener('click', deleteAccount);
} else {
  console.log("Button 'deleteaccount' doesn't exist on the page.");
}

fillTable();
// Assuming you have a variable called isAdminMode that indicates whether you're in admin mode or not
const dangerzoneDiv = document.getElementById('dangerzone');
const dangerZoneElement = document.createElement("div")
dangerZoneElement.classList.add("dangerzone-elem")

if (localData.mode == "admin") {
  // Admin mode: render title requests under a bold and small heading tag
  const heading = document.createElement('div');
  heading.id = 'requests_heading';
  const boldText = document.createElement('div');
  boldText.id = 'requests_bold';
  const smallText = document.createElement('small');
  smallText.id = 'requests_small';
  boldText.textContent = 'Requests';
  smallText.textContent = ' (Admin Mode)';
  heading.appendChild(boldText);
  heading.appendChild(smallText);

  // Create a div element for requests
  const requestsDiv = document.createElement('div');
  requestsDiv.id = 'requests';


  // Call the checkRequests function to populate the requests
} else {
  // Check the user's privilege level
  fetch(`/account/check-privilege?user=${localData.user}`)
    .then(response => response.json())
    .then(data => {
      if (data.length != 0) {
        // User has a privilege level
        const flag = data[0].flag;
        const update = document.createElement("div");
        if (flag == 1) {
          // Approved privilege level
          console.log("Approved");
          update.innerText = "You have been approved";
        } else if (flag == 0) {
          // No update yet
          console.log("No update yet");
          update.innerText = "No update yet";
        } else if (flag == -1) {
          // Request declined
          console.log('Request Declined');
          update.innerText = "You have been rejected";

          // Clear the privilege for the user
          fetch(`/account/clear-privilege?user=${localData.user}`, {
            method: 'DELETE'
          })
            .then(response => response.json())
            .then(data => {
              // Handle the response data
              console.log(data); // Output the response data to the console or perform further actions
            })
            .catch(error => {
              // Handle any errors that occur during the request
              console.error("Error:", error);
            });
        }
        // Append the update element to the dangerZoneElement
        dangerZoneElement.appendChild(update);
      } else {
        // User has no privilege level
        // Not in admin mode: render a button to request admin access
        const button = document.createElement('button');
        button.textContent = "Request admin access";
        button.addEventListener('click', requestAdminAccess);
        dangerZoneElement.appendChild(button);
      }
    })
    .catch(error => {
      // Handle any errors that occur during the request
      console.error("Error:", error);
    });

  // Append the dangerZoneElement to the dangerzoneDiv
  dangerzoneDiv.appendChild(dangerZoneElement);
}

const fileInput = document.getElementById('aws-call');
if(fileInput){
  fileInput.addEventListener('change',acceptFileInput);
}
else{
  console.log('Button fileInput does not exist');
}

function acceptFileInput(event) {
  const file = event.target.files[0];
  const fileName = file.name;
  const formData = new FormData();
  formData.append('jpeg', file);
  const fileSizeInMB = file.size / (1024 * 1024);
  console.log('File Size:', fileSizeInMB.toFixed(2), 'MB');

  // Send the form data to the server-side script
  fetch('/invoice/save-image', {
    method: 'POST',
    body: formData
  })
    .then(response => response.json())
    .then(data=>{
      var invoiceid =Math.floor(Math.random() * (2500 - 200 + 1)) + 100;
      var invoice_name = fileName;
      var uploadDate = new Date().toISOString().split('T')[0];
      var status ="Paid";
      var fakeTotal = Math.floor(Math.random() * (2000 - 200 + 1)) + 200;

      var fakerequestBody = {
        user: localData.user,
        invoiceid: invoiceid,
        invoice_name: invoice_name,
        upload_date: uploadDate,
        status: status,
        path: data,
        total:fakeTotal,
        type:"invoice"
      }

      sessionStorage.setItem('invoiceid',JSON.stringify(fakerequestBody.invoiceid));
      
      // Send the POST request to the server
      fetch('/invoice/insert-record', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(fakerequestBody)
      })
        .then(response => {
          if (response.ok) {
            console.log('Record inserted successfully.');
          } else {
            console.error('Failed to insert the record.');
          }
        })
        .catch(error => {
          console.error('Error occurred while inserting the record:', error);
        });
    })
    .catch(error => {
      console.error('Error occurred while saving the image:', error);

    });

    detectTextBuckets(formData).then(detectedText=>{
    const output = extractDetails(detectedText.invoice_data);
    const output2 = sanitizeDetails(output,detectedText.table_data);
    const payload= {extractedDetails :output2, table_data:detectedText.table_data};
      // console.log(payload);

      fetch('/invoice/save-detected-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ invoiceid:JSON.parse(sessionStorage.getItem('invoiceid')), detectedText: JSON.stringify(payload) })
      }).then(response=>response.json())
      .then(data=>{
      });
    })
    .catch(error=>{
      console.error("Error occured"+error);
    })


}

function fillTable() {
  document.getElementById('id').textContent = localData.id;
  document.getElementById('user').textContent = localData.user;
  document.getElementById('mode').textContent = localData.mode;
  document.getElementById('email').textContent = localData.Email;
}

function deleteAccount(event){    
  if(localData.mode=="guest"){
      fetch('/account/check-account', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(localData)
        })
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
          throw new Error('Network response was not ok.');
        })
        .then((result) => {
          if (result.exists) {
            // Account exists in SQL table
            console.log('Account exists');
            window.location.replace("https://localhost:3000");
          } else {
            // Account doesn't exist in SQL table
            console.log('Account does not exist');
          }
        })
        .catch((error) => {
          console.error('Error occurred during account check:', error);
        });   
  }
  else{
      alert("Website does not suppose admin account deletion currently ");
  }
}



function logout(){
  sessionStorage.removeItem('localData');
  localData = "";
  window.location.href = "../index.html";
}

function requestAdminAccess() {
  /**
  * Sends a request to elevate the user's privilege level to admin.
  * If the request is successful, it logs a success message.
  * If the request is pending approval, it logs a message indicating the account is waiting for approval.
  * If an error occurs during the process, it logs the error.
  */

  // Get the user requesting admin access from localData
  const user = `${localData.user}`; // Replace 'admin' with the actual user requesting admin access

  // Send a POST request to elevate-privilege endpoint with the user data
  fetch('/account/elevate-privilege', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ user })
  })
    .then(response => response.json())
    .then(data => {
      // Process the response data
      if (data.exists) {
        // Log a message if the account is waiting for approval
        console.log('Account is still waiting for approval');
      } else {
        // Log a success message if the request was successful
        console.log('Admin access requested successfully');
      }
    })
    .catch(error => {
      // Log any errors that occur during the process
      console.error('Error:', error);
    });
}


function respondRequest(user, value) {
  /**
  * Sends a request response to the server.
  * @param {string} user - The user associated with the request.
  * @param {string} value - The action value for the request.
  */
  // Create the payload object
  const payload = {
    user: user,
    action: value
  };

  // Log the payload for debugging purposes
  console.log(payload);

  // Send the payload to the server using fetch API
  fetch('/account/respond-request', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })
    .then(response => {
      if (response.ok) {
        // Handle successful response
        console.log('Request response sent successfully.');
      } else {
        // Handle error response
        console.error('Failed to send request response.');
      }
    })
    .catch(error => {
      console.error('An error occurred while sending request response:', error);
    });
}


function openImage(value){
window.open('http://127.0.0.1:8080/img-db/'+value);
}

function openText(value){
    const newURL = `http://localhost:8000/invoice/get-detected-text/${value}`;
        window.open(newURL);
}
