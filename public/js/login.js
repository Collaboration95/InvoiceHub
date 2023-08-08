document.getElementById("login-form").addEventListener("submit", function(event) {
  /**
  * Event listener attached to the login form submit event.
  * It prevents the form from submitting normally and calls the validateLogin function with the entered username and password.
  * @param {Event} event - The submit event triggered by the login form.
  */
  event.preventDefault(); // Prevent the form from submitting normally
  // Get the form data
  const formData = new FormData(event.target);
  const username = formData.get("username");
  const password = formData.get("password");
  // Call the validateLogin function and pass the form data
  validateLogin(username, password);
});

function validateLogin (username, password) {
  // Validate username and password for alphanumeric characters
  const alphanumericRegex = /^[a-zA-Z0-9]+$/;
  if (!alphanumericRegex.test(username) || !alphanumericRegex.test(password)) {
    alert('Invalid username or password. Username and password must be alphanumeric.');
    return;
  }

  // Proceed with the fetch request if both username and password are alphanumeric
  fetch('/account/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password })
  })
    .then(response => response.json())
    .then(data => {
      const login_verified = Object.keys(data).length;
      if (login_verified !== 0) {
        console.log("validateLogin() login successful")
        // If login is verified, store login info, redirect to homepage
        sessionStorage.setItem('localData', JSON.stringify(data));
        window.location.href = '../html/HomePage.html';
      } else {
        alert('Invalid username or password');
        console.log("validateLogin() invalid password")
      } 
    })
    .catch(error => console.error(error));
}