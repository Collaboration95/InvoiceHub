const { Builder, By, Key, until } = require('selenium-webdriver');
const assert = require('assert');

async function signupAndLoginTest(details) {
  // Set up the WebDriver
  const driver = await new Builder().forBrowser('chrome').build();

  try {
    // Navigate to the signup page
    await driver.get('http://localhost:8000/html/signup.html');
    await driver.manage().window().setRect({ width: 960, height: 852 });

    // Fill in the signup form details
    await driver.findElement(By.id('name')).sendKeys(details.name);
    await driver.findElement(By.id('password')).sendKeys(details.password);
    await driver.findElement(By.id('email')).sendKeys(details.email);
    await driver.findElement(By.id('user-type')).sendKeys(details.user_type);

    // Submit the signup form
    await driver.findElement(By.css('.dark-button')).click();

    // Wait for the next page to load (you may need to adjust this based on the actual behavior of the application)
    await driver.wait(until.urlIs('http://localhost:8000/html/login.html'), 5000);

    console.log('Signup successful! Navigated to HomePage.html after signup.');

    // Attempt to login with the signup details
    await driver.get('http://localhost:8000/html/login.html');

    // Fill in the login form with the signup details
    await driver.findElement(By.id('username')).sendKeys(details.name);
    await driver.findElement(By.id('password')).sendKeys(details.password);

    // Click the login button to submit the form
    await driver.findElement(By.css('.dark-button')).click();

    // Wait for the next page to load (HomePage.html in this case)
    await driver.wait(until.urlIs('http://localhost:8000/html/HomePage.html'), 5000);

    return "Signup test passed"
  } catch (error) {
    return "Login test failed"+error;
    throw error; // Rethrow the error for the fuzzing tests to catch
  } finally {
    // Close the browser after the test is done
    await driver.quit();
  }
}

async function fuzzertest() {
  const results = []; // Array to store the results of each fuzzing test

  // List of test data for fuzzing
  const testDataList = [
    { name: "johnDoe123", password: "pass123", email: "john@example.com", user_type: "admin" },
    { name: "Alice_123", password: "p@ssw0rd", email: "alice@example.com", user_type: "user" },
    { name: "user@name", password: "password", email: "user@example.com", user_type: "admin" },
    { name: "admin#1", password: "123456", email: "admin@example.com", user_type: "user" },
    // Add more test data as needed
  ];

  for (const testData of testDataList) {
    console.log("Fuzzing Test Data:");
    console.log("Name:", testData.name);
    console.log("Password:", testData.password);
    console.log("Email:", testData.email);
    console.log("User Type:", testData.user_type);
    console.log("==========================");
    
    const result = await signupAndLoginTest(testData);

    results.push({ ...testData, status: result });
  }
  return results;
}

// Call the fuzzertest function to start the fuzzing tests
fuzzertest().then((results) => {
  console.log('Fuzzing Test Results:');
  console.log(results);
});
