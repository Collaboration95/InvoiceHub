//final check by ramita and radhi (11/08)
// Generated by Selenium IDE
const { Builder, By, Key, until } = require('selenium-webdriver')
const assert = require('assert')

describe('homepageupload', function() {
  this.timeout(30000)
  let driver
  let vars
  beforeEach(async function() {
    driver = await new Builder().forBrowser('chrome').build()
    vars = {}
  })
  afterEach(async function() {
    await driver.quit();
  })
  it('homepageupload', async function() {
    await driver.get("http://localhost:8000/")
    await driver.manage().window().setRect({ width: 1010, height: 798 })
    await driver.findElement(By.linkText("Login")).click()
    await driver.findElement(By.id("username")).click()
    await driver.findElement(By.id("username")).sendKeys("radhi")
    await driver.findElement(By.id("password")).sendKeys("1234")
    await driver.findElement(By.id("password")).sendKeys(Key.ENTER)
    await driver.findElement(By.css(".upload_invoice")).click()
    await driver.findElement(By.id("file")).sendKeys("C:\\Users\\user\\OneDrive\\Documents\\SUTD Academics\\Term 5\\50.003\\cloned project\\InvoiceHub\\public\\img-db\\1691557240723-59fb6f40b8f5114a-TIPEX PTE. LTD (3)22.jpg")
    await driver.findElement(By.css(".invoice > div")).click()
  })
})
