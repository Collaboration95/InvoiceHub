// Generated by Selenium IDE
const { Builder, By, Key, until } = require('selenium-webdriver')
const assert = require('assert')

describe('Editing An Invoice Testing', function() {
  let driver;
  let vars;
  beforeEach(async function() {
    driver = await new Builder().forBrowser('chrome').build();
    vars = {};
  });
  afterEach(async function() {
    await driver.quit();
  },10000);
  it('when the user input correct type of name input -> successfully update', async function() {
    await driver.get("http://localhost:8000/");
    await driver.findElement(By.linkText("Login")).click();
    await driver.findElement(By.id("username")).sendKeys("test12");
    await driver.findElement(By.id("password")).sendKeys("3200");
    await driver.findElement(By.css(".dark-button")).click();
    await driver.sleep(2000);
    await driver.findElement(By.css(".invoice > div")).click();
    await driver.findElement(By.id("1811")).click();
    await driver.findElement(By.id("inp_comp_name")).click();
    await driver.findElement(By.id("inp_comp_name")).clear();
    await driver.findElement(By.id("inp_comp_name")).sendKeys("1_page-02.jpg");
    await driver.findElement(By.css(".btn_edit_update")).click();
    // expect(driver.findElement(By.id("invoice_table"[1].innerText))).toContain('1_page-02.jpg');
  }, 12000);
  it('when the user input wrong type of name input -> gives an error', async function() {
    await driver.get("http://localhost:8000/");
    await driver.findElement(By.linkText("Login")).click();
    await driver.findElement(By.id("username")).sendKeys("test12");
    await driver.findElement(By.id("password")).sendKeys("3200");
    await driver.findElement(By.css(".dark-button")).click();
    await driver.sleep(2000);
    await driver.findElement(By.css(".invoice > div")).click();
    await driver.findElement(By.id("1811")).click();
    await driver.findElement(By.id("inp_comp_name")).click();
    await driver.findElement(By.id("inp_comp_name")).clear();
    await driver.findElement(By.id("inp_comp_name")).sendKeys("1_page 02.jpg");
    await driver.findElement(By.css(".btn_edit_update")).click();
    // expect(driver.findElement(By.id("error_msg"))).toContain("Company name should not contain spaces. Please replace with '_'.");
    await driver.findElement(By.id("inp_comp_name")).click();
    await driver.findElement(By.id("inp_comp_name")).clear();
    await driver.findElement(By.id("inp_comp_name")).sendKeys("1_page_02.jpg");
    await driver.findElement(By.css(".btn_edit_update")).click();
    await driver.get("http://localhost:8000/");
    // expect(driver.findElement(By.id("invoice_table"[1].innerText))).toContain('1_page_02.jpg');
  }, 10000);
  it('when the user input correct date input -> successfully update', async function() {
    await driver.get("http://localhost:8000/");
    await driver.findElement(By.linkText("Login")).click();
    await driver.findElement(By.id("username")).sendKeys("test12");
    await driver.findElement(By.id("password")).sendKeys("3200");
    await driver.findElement(By.css(".dark-button")).click();
    await driver.findElement(By.css(".invoice > div")).click();
    await driver.findElement(By.id("1811")).click();
    await driver.findElement(By.id("inp_issue_date")).click();
    await driver.findElement(By.id("inp_issue_date")).clear();
    await driver.findElement(By.id("inp_comp_name")).clear();
    await driver.findElement(By.id("inp_issue_date")).sendKeys("11/07/2022");
    await driver.findElement(By.css(".btn_edit_update")).click();
  }, 10000);
  it('when the user input wrong date input -> gives an error', async function() {
    await driver.get("http://localhost:8000/");
    await driver.findElement(By.linkText("Login")).click();
    await driver.findElement(By.id("username")).sendKeys("test12");
    await driver.findElement(By.id("password")).sendKeys("3200");
    await driver.findElement(By.css(".dark-button")).click();
    await driver.findElement(By.css(".invoice > div")).click();
    await driver.findElement(By.id("1811")).click();
    await driver.findElement(By.id("inp_issue_date")).click();
    await driver.findElement(By.id("inp_issue_date")).clear();
    await driver.findElement(By.id("inp_issue_date")).sendKeys("11/30/2022");
    await driver.findElement(By.css(".btn_edit_update")).click();
    await driver.findElement(By.id("inp_issue_date")).click();
    await driver.findElement(By.id("inp_issue_date")).click();
    await driver.findElement(By.id("inp_issue_date")).click();
    {
      const element = await driver.findElement(By.id("inp_issue_date"));
      await driver.actions({ bridge: true}).doubleClick(element).perform();
    }
    await driver.findElement(By.id("inp_issue_date")).clear();
    await driver.findElement(By.id("inp_issue_date")).sendKeys("50/01/2022");
    await driver.findElement(By.css(".btn_edit_update")).click();
    await driver.findElement(By.id("inp_issue_date")).click();
    await driver.findElement(By.id("inp_issue_date")).clear();
    await driver.findElement(By.id("inp_issue_date")).sendKeys("10/01/2022");
    await driver.findElement(By.css(".btn_edit_update")).click();
  }, 10000);
  it('when the user input correct amount input -> successfully update', async function() {
    // need to test more -> sometimes doesn't fetch the data
    await driver.get("http://localhost:8000/");
    await driver.findElement(By.linkText("Login")).click();
    await driver.findElement(By.id("username")).sendKeys("test12");
    await driver.findElement(By.id("password")).sendKeys("3200");
    await driver.findElement(By.css(".dark-button")).click();
    await driver.findElement(By.css(".invoice > div")).click()
    await driver.findElement(By.id("1811")).click();
    await driver.findElement(By.id("inp_total_amount")).click()
    await driver.findElement(By.id("inp_total_amount")).clear();
    await driver.findElement(By.id("inp_total_amount")).sendKeys("7611.00")
    await driver.findElement(By.css(".btn_edit_update")).click()
  }, 10000);
  it('when the user input wrong type of amount input -> gives an error', async function() {
    // need to test more -> sometimes doesn't fetch the data
    await driver.get("http://localhost:8000/")
    await driver.manage().window().setRect({ width: 1246, height: 807 })
    await driver.findElement(By.linkText("Login")).click()
    await driver.findElement(By.id("username")).sendKeys("test12")
    await driver.findElement(By.id("password")).sendKeys("3200")
    await driver.findElement(By.css(".dark-button")).click()
    await driver.findElement(By.css(".invoice > div")).click()
    await driver.findElement(By.id("1811")).click()
    await driver.findElement(By.id("inp_total_amount")).click()
    await driver.findElement(By.id("inp_total_amount")).clear();
    await driver.findElement(By.id("inp_total_amount")).sendKeys("76as11.00")
    await driver.findElement(By.css(".btn_edit_update")).click()
    await driver.findElement(By.id("inp_total_amount")).click()
    await driver.findElement(By.id("inp_total_amount")).clear();
    await driver.findElement(By.id("inp_total_amount")).sendKeys("7611.00")
    await driver.findElement(By.css(".btn_edit_update")).click()
  }, 10000);
});

