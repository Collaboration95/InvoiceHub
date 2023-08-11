//final checked by ramita and radhi (11/08)
const { Builder, By, Key, until } = require('selenium-webdriver');
const assert = require('assert');

async function signupAndLoginTest() {
  // Set up the WebDriver
  const driver = await new Builder().forBrowser('chrome').build();

  try {
    // Navigate to the signup page
    await driver.get('http://localhost:8000/html/signup.html');
    await driver.manage().window().setRect({ width: 960, height: 852 });
    const generateRandomNumber = () => Math.floor(10000 + Math.random() * 90000);
    const randomNumber = generateRandomNumber();
    const details = {name: `randomusername${randomNumber}`, password: '3200', email: 'guruprasath3200@gmail.com', user_type: 'admin'}
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

    console.log('Login successful! Navigated to HomePage.html after login.');
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    // Close the browser after the test is done
    await driver.quit();
  }
}

// Run the signup and login test
signupAndLoginTest();
