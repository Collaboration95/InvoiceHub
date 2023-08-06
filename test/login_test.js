const { Builder, By, Key, until } = require('selenium-webdriver');
const assert = require('assert');

async function loginTest() {
  // Set up the WebDriver
  const driver = await new Builder().forBrowser('chrome').build();

  try {
    // Navigate to the login page
    await driver.get('http://localhost:8000/html/login.html');
    await driver.manage().window().setRect({ width: 960, height: 852 });

    // Find the username and password input elements and fill in the values
    await driver.findElement(By.id('username')).sendKeys('test12');
    await driver.findElement(By.id('password')).sendKeys('3200');

    // Click the login button to submit the form
    await driver.findElement(By.css('.dark-button')).click();

    // Wait for the next page to load (you might need to adjust this based on the actual behavior of the application)
    await driver.wait(until.titleIs('Invoice Hub'), 5000);

    // Verify that the login was successful (assert some element on the next page)

    await driver.wait(until.urlIs('http://localhost:8000/html/HomePage.html'), 5000);

    console.log('Login test passed!');
  } catch (error) {
    console.error('Login test failed:', error);
  } finally {
    // Close the browser after the test is done
    await driver.quit();
  }
}

// Run the login test
loginTest();
