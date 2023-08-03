//Testing using jest 
//const { retrieveData, showTable, getSelectedCheckboxValues } = require('./SupplierPage');

// Import the function to be tested
const { getSelectedCheckboxValues } = require('../public/js/SupplierPage');

// Create a mock DOM for the test
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const { document } = (new JSDOM('<!DOCTYPE html><html><body></body></html>')).window;
global.document = document;
global.window = document.defaultView;

// const mockData = [
//     {   // Mock data for testing
//       company_name: 'Company A',
//       contact_number: '1234567890',
//       address: 'Address A',
//       email: 'companya@example.com',
//     },
//     {
//       company_name: 'Company B',
//       contact_number: '9876543210',
//       address: 'Address B',
//       email: 'companyb@example.com',
//     },
//   ];


//test 1 : test ShowTable 
//test 2: test retrive data 
//test 3: test on getSelectedCheckboxValues
describe('getSelectedCheckboxValues',() =>{
  test('should return an empty array when no checboxes are selected', () => {
    document.body.innerHTML = '<input type="checkbox" name="selectedRow" value="Company A">';
    const selectedValues = getSelectedCheckboxValues();
    expect(selectedValues).toEqual([]);
  });

  test('should return an array of selected checkbox values', () =>{
    document.body.innerHTML =`
      <input type="checkbox" name="selectedRow" value="Company A" checked>
      <input type="checkbox" name="selectedRow" value="Company B"></input>
    `
    const selectedValues = getSelectedCheckboxValues();
    expect(selectedValues).toEqual(['Company A']);

  });

  })



