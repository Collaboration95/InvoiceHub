//final checked by ramita and radhi (11/08)
const { Builder, By, Key, until } = require('selenium-webdriver');
const assert = require('assert');

async function loginTest(username,password) {
  // Set up the WebDriver
  const driver = await new Builder().forBrowser('chrome').build();

  try {
    // Navigate to the login page
    await driver.get('http://localhost:8000/html/login.html');
    await driver.manage().window().setRect({ width: 960, height: 852 });

    // Find the username and password input elements and fill in the values
    await driver.findElement(By.id('username')).sendKeys(username);
    await driver.findElement(By.id('password')).sendKeys(password);

    // Click the login button to submit the form
    await driver.findElement(By.css('.dark-button')).click();

    // Wait for the next page to load (you might need to adjust this based on the actual behavior of the application)
    await driver.wait(until.titleIs('Invoice Hub'), 5000);

    // Verify that the login was successful (assert some element on the next page)

    await driver.wait(until.urlIs('http://localhost:8000/html/HomePage.html'), 5000);

    return "Passed";
  } catch (error) {

    return "Login test failed" + error;
  } finally {
    // Close the browser after the test is done
    await driver.quit();
  }
}

async function fuzzertest() {
  const results = []; // Array to store the results of each fuzzing test

  // List of test data for fuzzing
  const testDataList = [
    { username: "test12", password: "3200" },
    { username: "johnDoe123", password: "pass123" },
    { username: "Alice_123", password: "p@ssw0rd" },
    { username: "user@name", password: "password" },
    { username: "admin#1", password: "123456" },
    // Add more test data as needed
  ];

  for (const testData of testDataList) {
    console.log("Fuzzing Test Data:");
    console.log("Username:", testData.username);
    console.log("Password:", testData.password);
    console.log("==========================");


      const result = await loginTest(testData.username, testData.password);

      results.push({ ...testData, status: result });

  }

  return results;
}
// Call the fuzzertest function to start the fuzzing tests
fuzzertest().then((results) => {
  console.log('Fuzzing Test Results:');
  console.log(results);
})