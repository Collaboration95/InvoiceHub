// Generated by Selenium IDE
const { Builder, By, Key, until } = require('selenium-webdriver')
const assert = require('assert')

describe('HomePagegraph', function() {
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
  it('HomePagegraph', async function() {
    await driver.get("http://localhost:8000/")
    await driver.manage().window().setRect({ width: 1010, height: 798 })
    await driver.findElement(By.linkText("Login")).click()
    await driver.findElement(By.id("username")).click()
    await driver.findElement(By.id("username")).sendKeys("test12")
    await driver.findElement(By.id("password")).sendKeys("3200")
    await driver.findElement(By.css(".dark-button")).click()
  })
})