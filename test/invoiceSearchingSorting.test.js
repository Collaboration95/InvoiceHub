// const jsdom = require('jsdom');
// const { JSDOM } = jsdom;

// // Create a fake DOM environment before running the tests
// const dom = new JSDOM('<!doctype html><html><body><table id="invoice_table"></table></body></html>');
// global.document = dom.window.document;
// global.window = dom.window;
// global.fetch = require('node-fetch'); 

// // Now you can run your test cases
// const invoicePage = require('../public/js/InvoicePage.js');

// describe('Testing the searching and sorting function on Invoice Page', () => {
//   let mockData;
//   mockData = [
//     { users: 'test12', id: '1016', company_name: 'Sample 1', issued_date: 'June 15, 2023', amount:'$S 3617.15', status: 'PAID', action:'' },
//     { users: 'test12', id: '1015', company_name: 'Sample 2', issued_date: 'June 14, 2023', amount:'$S 492.90', status: 'OVERDUE', action:'' },
//     { users: 'test12', id: '1014', company_name: 'Sample 3', issued_date: 'June 10, 2023', amount:'$S 853.23', status: 'PAID', action:'' },
//     { users: 'test12', id: '1013', company_name: 'Sample 4', issued_date: 'June 3, 2023', amount:'$S 1242.74', status: 'PAID', action:'' },
//     { users: 'test12', id: '1012', company_name: 'Sample 5', issued_date: 'June 2, 2023', amount:'$S 362.40', status: 'DRAFT', action:'' },
//     { users: 'test12', id: '1011', company_name: 'Sample 6', issued_date: 'June 1, 2023', amount:'$S 162.82', status: 'OVERDUE', action:'' }
//     ];

//   beforeEach(() => {
//     global.fetch = jest.fn(() => Promise.resolve({ json: () => Promise.resolve(mockData)}));
//     // render the table with mock data
//     console.log(mockData);
//     // invoicePage.getData().then(data => invoicePage.renderTable(mockData));
//   });

//   // Seraching function related to ID
//   test('when the user chooses ID and correct type input -> have matching data', () => {
//     // var input = document.getElementById("inp_search_blank");
//     input.value = '1016';
//     // var searchDropdown = document.getElementById("search_type_dropdown");
//     searchDropdown.value = 'id';
  
//     // Trigger the keyup event to initiate the search
//     const event = new Event('keyup');
//     input.dispatchEvent(event);
  
//     // Get the table rows after searching
//     const tableRows = document.querySelectorAll('#invoice_table tr');
  
//     // Expect that only one row with '1016' should be displayed after the search
//     expect(tableRows.length).toBe(2); 
//     expect(tableRows[1].innerText).toContain('1016');
//   });
  
//   // test('when the user chooses ID and correct type of input -> have no matching data', () => {
//   //   var input = document.getElementById("inp_search_blank");
//   //   input.value = '9999'; // Any value that does not exist in the mock data
//   //   var searchDropdown = document.getElementById("search_type_dropdown");
//   //   searchDropdown.value = 'id';
  
//   //   // Trigger the keyup event to initiate the search
//   //   const event = new Event('keyup');
//   //   input.dispatchEvent(event);
  
//   //   // Get the table rows after searching
//   //   const tableRows = document.querySelectorAll('#invoice_table tr');
  
//   //   // Expect that no rows should be displayed after the search
//   //   expect(tableRows.length).toBe(1); // Only the header row should be present
//   // });
  
//   // test('when the user chooses ID and wrong types of input -> have no matching data', () => {
//   //   var input = document.getElementById("inp_search_blank");
//   //   input.value = 'abc123'; // A value that is not a valid ID format
//   //   var searchDropdown = document.getElementById("search_type_dropdown");
//   //   searchDropdown.value = 'id';
  
//   //   // Trigger the keyup event to initiate the search
//   //   const event = new Event('keyup');
//   //   input.dispatchEvent(event);
  
//   //   // Get the table rows after searching
//   //   const tableRows = document.querySelectorAll('#invoice_table tr');
  
//   //   // Expect that no rows should be displayed after the search
//   //   expect(tableRows.length).toBe(1); // Only the header row should be present
//   // });
  
//   // // Sorting function related to ID
//   // test('when the user chooses ID and click the ascending button -> show data in ascending order with ID', () => {
//   //   var ascendingButton = document.getElementById('ic_sort_asc');
//   //   ascendingButton.click();
  
//   //   // Get the table rows after sorting
//   //   const tableRows = document.querySelectorAll('#invoice_table tr');
  
//   //   // Get the IDs from the sorted rows (excluding the header row)
//   //   const sortedIds = Array.from(tableRows).slice(1).map(row => row.cells[0].innerText);
  
//   //   // Sort the IDs from the original data in ascending order
//   //   const originalIds = mockData.map(item => item.id).sort((a, b) => parseInt(a) - parseInt(b));
  
//   //   // Expect that the sorted IDs match the IDs from the original data
//   //   expect(sortedIds).toEqual(originalIds);
//   // });
  
//   // test('when the user chooses ID and click the descending button -> show data in descending order with ID', () => {
//   //   var descendingButton = document.getElementById('ic_sort_des');
//   //   descendingButton.click();
  
//   //   // Get the table rows after sorting
//   //   const tableRows = document.querySelectorAll('#invoice_table tr');
  
//   //   // Get the IDs from the sorted rows (excluding the header row)
//   //   const sortedIds = Array.from(tableRows).slice(1).map(row => row.cells[0].innerText);
  
//   //   // Sort the IDs from the original data in descending order
//   //   const originalIds = mockData.map(item => item.id).sort((a, b) => parseInt(b) - parseInt(a));
  
//   //   // Expect that the sorted IDs match the IDs from the original data
//   //   expect(sortedIds).toEqual(originalIds);
//   // });
  
// });

// Generated by Selenium IDE
const { Builder, By, Key, until } = require('selenium-webdriver');
const assert = require('assert');

describe('Searching and Sorting Testing', function() {
  this.timeout(30000);
  let driver;
  let vars;
  beforeEach(async function() {
    driver = await new Builder().forBrowser('chrome').build();
    vars = {};
    await driver.get("http://localhost:8000/");
    // await driver.manage().window().setRect({ width: 784, height: 867 });
    await driver.findElement(By.linkText("Login")).click();
    await driver.findElement(By.id("username")).sendKeys("test12");
    await driver.findElement(By.id("password")).sendKeys("3200");
    await driver.findElement(By.css(".dark-button")).click();
  })
  afterEach(async function() {
    await driver.quit();
  })
  it('when the user chooses ID and correct type input -> have matching data', async function() {
    await driver.findElement(By.css(".invoice > div")).click();
    await driver.findElement(By.id("search_type_dropdown")).click();
    await driver.findElement(By.id("inp_search_blank")).click();
    await driver.findElement(By.id("inp_search_blank")).sendKeys("1811");
    expect(driver.findElement(By.id("invoice_table")).length).toBe(2); 
    expect(driver.findElement(By.id("invoice_table"[1])).innerText).toContain('1016');
  });
  it('when the user chooses ID and correct type input -> have no matching data', async function() {
    await driver.findElement(By.css(".invoice > div")).click();
    await driver.findElement(By.id("search_type_dropdown")).click();
    await driver.findElement(By.id("inp_search_blank")).click();
    await driver.findElement(By.id("inp_search_blank")).sendKeys("1111");
    expect(driver.findElement(By.id("invoice_table".length))).toBe(1); 
  });
  it('when the user chooses ID and wrong type input -> have no matching data', async function() {
    await driver.findElement(By.css(".invoice > div")).click();
    await driver.findElement(By.id("search_type_dropdown")).click();
    await driver.findElement(By.id("inp_search_blank")).click();
    await driver.findElement(By.id("inp_search_blank")).sendKeys("hello");
    expect(driver.findElement(By.id("invoice_table".length))).toBe(1); 
  });
  it('When the user choose ID and press descending button', async function() {
    await driver.findElement(By.css(".invoice > div")).click();
    await driver.findElement(By.id("sort_dropdown")).click();
    await driver.findElement(By.css("#ic_sort_des > path")).click();
    // add expect line for checking
  });
  it('When the user choose ID and press descending button', async function() {
    await driver.findElement(By.css(".invoice > div")).click();
    await driver.findElement(By.id("sort_dropdown")).click();
    await driver.findElement(By.id("ic_sort_asc")).click();
    // add expect line for checking
  });
});
