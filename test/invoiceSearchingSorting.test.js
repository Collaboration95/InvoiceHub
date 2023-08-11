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
    await driver.findElement(By.css(".invoice > div")).click();
    await driver.findElement(By.id("search_type_dropdown")).click();
    await driver.findElement(By.id("inp_search_blank")).click();
    await driver.findElement(By.id("inp_search_blank")).sendKeys("1811");
  }, 12000);
  it('when the user chooses ID and correct type input -> have no matching data', async function() {
    await driver.get("http://localhost:8000/");
    await driver.findElement(By.linkText("Login")).click();
    await driver.findElement(By.id("username")).sendKeys("test12");
    await driver.findElement(By.id("password")).sendKeys("3200");
    await driver.findElement(By.css(".dark-button")).click();
    await driver.findElement(By.css(".invoice > div")).click();
    await driver.findElement(By.id("search_type_dropdown")).click();
    await driver.findElement(By.id("inp_search_blank")).click();
    await driver.findElement(By.id("inp_search_blank")).sendKeys("1111");
  }, 10000);
  it('when the user chooses ID and wrong type input -> have no matching data', async function() {
    await driver.get("http://localhost:8000/");
    await driver.findElement(By.linkText("Login")).click();
    await driver.findElement(By.id("username")).sendKeys("test12");
    await driver.findElement(By.id("password")).sendKeys("3200");
    await driver.findElement(By.css(".dark-button")).click();
    await driver.findElement(By.css(".invoice > div")).click();
    await driver.findElement(By.id("search_type_dropdown")).click();
    await driver.findElement(By.id("inp_search_blank")).click();
    await driver.findElement(By.id("inp_search_blank")).sendKeys("hello");
  }, 10000);
  it('When the user choose ID and press descending button', async function() {
    await driver.get("http://localhost:8000/");
    await driver.findElement(By.linkText("Login")).click();
    await driver.findElement(By.id("username")).sendKeys("test12");
    await driver.findElement(By.id("password")).sendKeys("3200");
    await driver.findElement(By.css(".dark-button")).click();
    await driver.findElement(By.css(".invoice > div")).click();
    await driver.findElement(By.id("sort_dropdown")).click();
    await driver.findElement(By.id("ic_sort_des")).click();
  }, 10000);
  it('When the user choose ID and press descending button', async function() {
    await driver.get("http://localhost:8000/");
    await driver.findElement(By.linkText("Login")).click();
    await driver.findElement(By.id("username")).sendKeys("test12");
    await driver.findElement(By.id("password")).sendKeys("3200");
    await driver.findElement(By.css(".dark-button")).click();
    await driver.findElement(By.css(".invoice > div")).click();
    await driver.findElement(By.id("sort_dropdown")).click();
    await driver.findElement(By.id("ic_sort_asc")).click();
  }, 10000);
});
