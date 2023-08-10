// Generated by Selenium IDE
const { Builder, By, Key, until } = require('selenium-webdriver');
const assert = require('assert');

describe('Searching and Sorting Testing', function() {
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
  it('when the user chooses ID and correct type input -> have matching data', async function() {
    await driver.get("http://localhost:8000/");
    await driver.findElement(By.linkText("Login")).click();
    await driver.findElement(By.id("username")).sendKeys("test12");
    await driver.findElement(By.id("password")).sendKeys("3200");
    await driver.findElement(By.css(".dark-button")).click();
    await driver.sleep(2000);
    await driver.findElement(By.css(".payment > div")).click();
    await driver.findElement(By.id("search_type_dropdown")).click();
    await driver.findElement(By.id("inp_search_blank")).click();
    await driver.findElement(By.id("inp_search_blank")).sendKeys("1208");
  }, 12000);
  it('when the user chooses Name and correct type input -> have matching data', async function() {
    await driver.get("http://localhost:8000/");
    await driver.findElement(By.linkText("Login")).click();
    await driver.findElement(By.id("username")).sendKeys("test12");
    await driver.findElement(By.id("password")).sendKeys("3200");
    await driver.findElement(By.css(".dark-button")).click();
    await driver.findElement(By.css(".payment > div")).click();
    await driver.findElement(By.id("search_type_dropdown")).click();
    await driver.findElement(By.id("inp_search_blank")).click();
    await driver.findElement(By.id("inp_search_blank")).sendKeys("1111");
  }, 10000);
  it('When the user selects checkbox', async function() {
    await driver.get("http://localhost:8000/");
    await driver.findElement(By.linkText("Login")).click();
    await driver.findElement(By.id("username")).sendKeys("test12");
    await driver.findElement(By.id("password")).sendKeys("3200");
    await driver.findElement(By.css(".dark-button")).click();
    await driver.findElement(By.css(".payment > div")).click();
    await driver.findElement(By.css('input[name="selectedRow"][value="602"]')).click();
  }, 10000);
  it('when user presses selects all button', async function() {
    await driver.get("http://localhost:8000/");
    await driver.findElement(By.linkText("Login")).click();
    await driver.findElement(By.id("username")).sendKeys("test12");
    await driver.findElement(By.id("password")).sendKeys("3200");
    await driver.findElement(By.css(".dark-button")).click();
    await driver.findElement(By.css(".payment > div")).click();
    await driver.findElement(By.id("selectAllButton")).click();
  }, 10000);
  it('when user presses deselects all button', async function() {
    await driver.get("http://localhost:8000/");
    await driver.findElement(By.linkText("Login")).click();
    await driver.findElement(By.id("username")).sendKeys("test12");
    await driver.findElement(By.id("password")).sendKeys("3200");
    await driver.findElement(By.css(".dark-button")).click();
    await driver.findElement(By.css(".payment > div")).click();
    await driver.findElement(By.id("selectAllButton")).click();
    await driver.findElement(By.id("deselectAllButton")).click();
  }, 10000);
  it('Testing process of payment with cash/paynow/cheque', async function() {
    await driver.get("http://localhost:8000/");
    await driver.findElement(By.linkText("Login")).click();
    await driver.findElement(By.id("username")).sendKeys("test12");
    await driver.findElement(By.id("password")).sendKeys("3200");
    await driver.findElement(By.css(".dark-button")).click();
    await driver.findElement(By.css(".payment > div")).click();
    await driver.findElement(By.css('input[name="selectedRow"][value="170"]')).click();
    await driver.findElement(By.id("nextButton")).click();
    await driver.findElement(By.id('date_input')).sendKeys('04-08-2023'); 
    await driver.findElement(By.id('amount_paid')).sendKeys('104.03'); 
    await driver.findElement(By.id('payment_type')).sendKeys('cash'); 
    await driver.findElement(By.id('bank_number')).sendKeys('nil'); 
    await driver.findElement(By.id("submit-button")).click();
  }, 10000);
});
