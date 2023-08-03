// using Selenium testing

const { Builder, By, Key, until } = require('selenium-webdriver');
const assert = require('assert');

describe('Testing input boxes', function() {
    // this.timeout(30000);
    let driver;
    let vars;
    beforeEach(async function() {
      driver = await new Builder().forBrowser('chrome').build();
      vars = {};
    });
    afterEach(async function() {
      await driver.quit();
    });

    it('should fill in input fields and navigate to NewSupplier.html after clicking submit button' , async() =>{
         // Fill in the input fields with test data
    await driver.findElement(By.id('contact_number')).sendKeys('55667788');
    await driver.findElement(By.id('Address')).sendKeys('Test Address');
    await driver.findElement(By.id('Email')).sendKeys('test@gmail.com');

    // Submit  form
    await driver.findElement(By.id('submit-button')).click();
    // Waiting for the success message (Assuming the redirection to 'NewSupplier.html' indicates success)
    await driver.wait(until.urlIs('file:///public/html/NewSupplier.html?redirect=true'), 5000);
    });
    

    it('should navigate back to NewSupplier.html when back button is clicked', async () =>{
        await driver.findElement(By.className('back-button')).click();

        await driver.wait(until.urlIs('file:///public/html/NewSupplier.html'), 5000);
    });





})








