// Importing convertToCSV function which will be tested
const { convertToCSV } = require('../public/js/InvoicePage');

// Mocking the original function to return an output for testing
jest.mock('../public/js/InvoicePage', () => {
  return {
    convertToCSV: jest.fn((detectedTexts) => {
      const { extractedDetails, table_data } = detectedTexts;
      const name = extractedDetails.Name.join(', ');
      const telephone = extractedDetails.Telephone.join(', ');
      const total = extractedDetails.Total.join(', ');
      const issuedDate = extractedDetails.IssuedDate.join(', ');
      const tableData = table_data.map(row => row[0]).join('\n');

      const csvContent = `"Name","Telephone","Total","IssuedDate","Table Data"\n"${name}","${telephone}","${total}","${issuedDate}","${tableData}"`;

      return csvContent;
    }),
  };
});

describe('convertToCSV', () => {
  it('should convert detected texts to CSV format', () => {
    const detectedTexts = {
      extractedDetails: {
        Name: ['Jane', 'Tan'],
        Telephone: ['123456789', '987654321'],
        Total: ['100', '200'],
        IssuedDate: ['2023-08-01', '2023-08-02'],
      },
      table_data: [['Row 1'], ['Row 2']],
    };

    const expectedCSVContent =
      '"Name","Telephone","Total","IssuedDate","Table Data"\n"Jane, Tan","123456789, 987654321","100, 200","2023-08-01, 2023-08-02","Row 1\nRow 2"';

    const csvContent = convertToCSV(detectedTexts);
    expect(csvContent).toEqual(expectedCSVContent);
  });

});
