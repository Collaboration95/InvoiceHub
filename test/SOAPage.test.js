//final check by radhi and ramita (11/08)
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
  },10000);
  afterEach(async function() {
    await driver.quit();
  },10000);
  it('when the user chooses ID and correct type input -> have matching data', async function() {
    await driver.get("http://localhost:8000/");
    await driver.findElement(By.linkText("Login")).click();
    await driver.findElement(By.id("username")).sendKeys("test12");
    await driver.findElement(By.id("password")).sendKeys("3200");
    await driver.findElement(By.css(".dark-button")).click();
    await driver.sleep(2000);
    await driver.findElement(By.css(".soa > div")).click();
    await driver.findElement(By.id("search_type_dropdown")).click();
    await driver.findElement(By.id("inp_search_blank")).click();
    await driver.findElement(By.id("inp_search_blank")).sendKeys("790");
  }, 12000);

});
