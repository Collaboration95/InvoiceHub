// import the invoice page js file

const {getData, sort_des, sort_asc} = require('../public/js/InvoicePage');

// GETDATA: mocking the original function to return an output for testing
jest.mock('../public/js/InvoicePage', () => {
    return {
        getData: jest.fn(() => {
            try {
                const response = null;
                const sample_data = [
                    { users: 'test12', id: '1016', name: 'Floppy Pte Ltd', date: 'June 15, 2023', amount: '$S 3617.15', status: 'PAID', action: '' },
                    { users: 'test12', id: '1015', name: 'Floppy Pte Ltd', date: 'June 14, 2023', amount: '$S 492.90', status: 'PAID', action: '' },
                    { users: 'test12', id: '1014', name: 'Floppy Pte Ltd', date: 'June 10, 2023', amount: '$S 853.23', status: 'PAID', action: '' },
                    { users: 'test12', id: '1013', name: 'Piong Cha Ptd Ltd', date: 'June 3, 2023', amount: '$S 1242.74', status: 'PAID', action: '' },
                    { users: 'test12', id: '1012', name: 'Piong Cha Ptd Ltd', date: 'June 2, 2023', amount: '$S 362.40', status: 'DRAFT', action: '' },
                    { users: 'test12', id: '1011', name: 'Piong Cha Ptd Ltd', date: 'June 1, 2023', amount: '$S 162.82', status: 'OVERDUE', action: '' }
                ];
                
                  sample_data.forEach((invoice) => {
                  // Determine statusColor based on status
                  if (invoice.status.toUpperCase() === 'DRAFT') {
                    invoice.statusColor = '#acacac';
                  } else if (invoice.status.toUpperCase() === 'OVERDUE') {
                    invoice.statusColor = 'rgb(252, 183, 137)';
                  } else if (invoice.status.toUpperCase() === 'PAID') {
                    invoice.statusColor = 'rgb(136, 197, 136)';
                  }
                });
                return sample_data;
              } catch (error) {
                console.error('Error fetching invoices data:', error);
              }
        }),
        sort_des: jest.fn((dropdownChoice) => {
            const sample_data = [
                { users: 'test12', id: '1016', name: 'Floppy Pte Ltd', date: 'June 15, 2023', amount: '3617.15', status: 'PAID', action: '' },
                { users: 'test12', id: '1015', name: 'Floppy Pte Ltd', date: 'June 14, 2023', amount: '492.90', status: 'PAID', action: '' },
                { users: 'test12', id: '1014', name: 'Floppy Pte Ltd', date: 'June 10, 2023', amount: '853.23', status: 'PAID', action: '' },
                { users: 'test12', id: '1013', name: 'Piong Cha Ptd Ltd', date: 'June 3, 2023', amount: '1242.74', status: 'PAID', action: '' },
                { users: 'test12', id: '1012', name: 'Piong Cha Ptd Ltd', date: 'June 2, 2023', amount: '362.40', status: 'DRAFT', action: '' },
                { users: 'test12', id: '1011', name: 'Piong Cha Ptd Ltd', date: 'June 1, 2023', amount: '162.82', status: 'OVERDUE', action: '' }
            ];
            
                var selectedValue = dropdownChoice;
            
                if (selectedValue === 'id_choice') {
                    sample_data.sort(function (a, b) {
                    return parseInt(b.id) - parseInt(a.id);
                  });
                } else if (selectedValue === 'id_date') {
                    sample_data.sort(function (a, b) {
                    var dateA = new Date(a.date);
                    var dateB = new Date(b.date);
                    return dateA - dateB;
                  });
                } else if (selectedValue === "id_name") {
                    sample_data.sort(function (a, b) {
                    return b.name.localeCompare(a.name);
                  });
                } else if (selectedValue === 'id_amount') {
                    sample_data.sort(function (a, b) {
                    return parseInt(b.amount) - parseInt(a.amount);
                  });
                }
                return sample_data;
        }),
        sort_asc: jest.fn((dropdownChoice) => {
            const sample_data = [
                { users: 'test12', id: '1016', name: 'Floppy Pte Ltd', date: 'June 15, 2023', amount: '3617.15', status: 'PAID', action: '' },
                { users: 'test12', id: '1015', name: 'Floppy Pte Ltd', date: 'June 14, 2023', amount: '492.90', status: 'PAID', action: '' },
                { users: 'test12', id: '1014', name: 'Floppy Pte Ltd', date: 'June 10, 2023', amount: '853.23', status: 'PAID', action: '' },
                { users: 'test12', id: '1013', name: 'Piong Cha Ptd Ltd', date: 'June 3, 2023', amount: '1242.74', status: 'PAID', action: '' },
                { users: 'test12', id: '1012', name: 'Piong Cha Ptd Ltd', date: 'June 2, 2023', amount: '362.40', status: 'DRAFT', action: '' },
                { users: 'test12', id: '1011', name: 'Piong Cha Ptd Ltd', date: 'June 1, 2023', amount: '162.82', status: 'OVERDUE', action: '' }
            ];
            
                var selectedValue = dropdownChoice;
            
                if (selectedValue === 'id_choice') {
                    sample_data.sort(function (a, b) {
                    return parseInt(a.id) - parseInt(b.id);
                  });
                } else if (selectedValue === 'id_date') {
                    sample_data.sort(function (a, b) {
                    var dateA = new Date(a.date);
                    var dateB = new Date(b.date);
                    return dateB - dateA;
                  });
                } else if (selectedValue === "id_name") {
                    sample_data.sort(function (a, b) {
                    return a.name.localeCompare(b.name);
                  });
                } else if (selectedValue === 'id_amount') {
                    sample_data.sort(function (a, b) {
                    return parseInt(a.amount) - parseInt(b.amount);
                  });
                }
                return sample_data;
        })
    };
});

describe('getData function test', () => {
    it("get the data and changes color of each status column's color", async () => {
        output = [
            { users: 'test12', id: '1016', name: 'Floppy Pte Ltd', date: 'June 15, 2023', amount:'$S 3617.15', status: 'PAID', statusColor: "rgb(136, 197, 136)", action:'' },
            { users: 'test12', id: '1015', name: 'Floppy Pte Ltd', date: 'June 14, 2023', amount:'$S 492.90', status: 'PAID', statusColor: "rgb(136, 197, 136)", action:'' },
            { users: 'test12', id: '1014', name: 'Floppy Pte Ltd', date: 'June 10, 2023', amount:'$S 853.23', status: 'PAID', statusColor: "rgb(136, 197, 136)", action:'' },
            { users: 'test12', id: '1013', name: 'Piong Cha Ptd Ltd', date: 'June 3, 2023', amount:'$S 1242.74', status: 'PAID', statusColor: "rgb(136, 197, 136)", action:'' },
            { users: 'test12', id: '1012', name: 'Piong Cha Ptd Ltd', date: 'June 2, 2023', amount:'$S 362.40', status: 'DRAFT', statusColor: "#acacac", action:'' },
            { users: 'test12', id: '1011', name: 'Piong Cha Ptd Ltd', date: 'June 1, 2023', amount:'$S 162.82', status: 'OVERDUE', statusColor: "rgb(252, 183, 137)", action:'' }
          ];
        data = await getData();
        expect(data).toEqual(output);
        expect(data[0].statusColor).toEqual('rgb(136, 197, 136)');
        expect(data[4].statusColor).toEqual('#acacac');
        expect(data[5].statusColor).toEqual('rgb(252, 183, 137)');
    });
});
describe('sort_des and sort_asc test', () => {
    it("when the user choose 'id', get the data and sort the data with id in descending order", async () => {
        output = [
            { users: 'test12', id: '1016', name: 'Floppy Pte Ltd', date: 'June 15, 2023', amount:'3617.15', status: 'PAID', action:'' },
            { users: 'test12', id: '1015', name: 'Floppy Pte Ltd', date: 'June 14, 2023', amount:'492.90', status: 'PAID', action:'' },
            { users: 'test12', id: '1014', name: 'Floppy Pte Ltd', date: 'June 10, 2023', amount:'853.23', status: 'PAID', action:'' },
            { users: 'test12', id: '1013', name: 'Piong Cha Ptd Ltd', date: 'June 3, 2023', amount:'1242.74', status: 'PAID', action:'' },
            { users: 'test12', id: '1012', name: 'Piong Cha Ptd Ltd', date: 'June 2, 2023', amount:'362.40', status: 'DRAFT', action:'' },
            { users: 'test12', id: '1011', name: 'Piong Cha Ptd Ltd', date: 'June 1, 2023', amount:'162.82', status: 'OVERDUE', action:'' }
          ];
        data = await sort_des('id_choice'); 
        expect(data).toEqual(output);         
    });
    it("when the user choose 'id', get the data and sort the data with id in ascending order", async () => {
        output = [
            { users: 'test12', id: '1011', name: 'Piong Cha Ptd Ltd', date: 'June 1, 2023', amount: '162.82', status: 'OVERDUE', action: '' },
            { users: 'test12', id: '1012', name: 'Piong Cha Ptd Ltd', date: 'June 2, 2023', amount: '362.40', status: 'DRAFT', action: '' },
            { users: 'test12', id: '1013', name: 'Piong Cha Ptd Ltd', date: 'June 3, 2023', amount: '1242.74', status: 'PAID', action: '' },
            { users: 'test12', id: '1014', name: 'Floppy Pte Ltd', date: 'June 10, 2023', amount: '853.23', status: 'PAID', action: '' },
            { users: 'test12', id: '1015', name: 'Floppy Pte Ltd', date: 'June 14, 2023', amount: '492.90', status: 'PAID', action: '' },
            { users: 'test12', id: '1016', name: 'Floppy Pte Ltd', date: 'June 15, 2023', amount: '3617.15', status: 'PAID', action: '' }
          ];
          data = await sort_asc('id_choice'); 
        expect(data).toEqual(output); 
    });
    it("when the user choose 'date', get the data and sort the data with date in descending order", async () => {
        output = [
            { users: 'test12', id: '1011', name: 'Piong Cha Ptd Ltd', date: 'June 1, 2023', amount: '162.82', status: 'OVERDUE', action: '' },
            { users: 'test12', id: '1012', name: 'Piong Cha Ptd Ltd', date: 'June 2, 2023', amount: '362.40', status: 'DRAFT', action: '' },
            { users: 'test12', id: '1013', name: 'Piong Cha Ptd Ltd', date: 'June 3, 2023', amount: '1242.74', status: 'PAID', action: '' },
            { users: 'test12', id: '1014', name: 'Floppy Pte Ltd', date: 'June 10, 2023', amount: '853.23', status: 'PAID', action: '' },
            { users: 'test12', id: '1015', name: 'Floppy Pte Ltd', date: 'June 14, 2023', amount: '492.90', status: 'PAID', action: '' },
            { users: 'test12', id: '1016', name: 'Floppy Pte Ltd', date: 'June 15, 2023', amount: '3617.15', status: 'PAID', action: '' }
          ];
          data = await sort_des('id_date'); 
        expect(data).toEqual(output); 
    });
    it("when the user choose 'date', get the data and sort the data with date in ascending order", async () => {
        output = [
            { users: 'test12', id: '1016', name: 'Floppy Pte Ltd', date: 'June 15, 2023', amount:'3617.15', status: 'PAID', action:'' },
            { users: 'test12', id: '1015', name: 'Floppy Pte Ltd', date: 'June 14, 2023', amount:'492.90', status: 'PAID', action:'' },
            { users: 'test12', id: '1014', name: 'Floppy Pte Ltd', date: 'June 10, 2023', amount:'853.23', status: 'PAID', action:'' },
            { users: 'test12', id: '1013', name: 'Piong Cha Ptd Ltd', date: 'June 3, 2023', amount:'1242.74', status: 'PAID', action:'' },
            { users: 'test12', id: '1012', name: 'Piong Cha Ptd Ltd', date: 'June 2, 2023', amount:'362.40', status: 'DRAFT', action:'' },
            { users: 'test12', id: '1011', name: 'Piong Cha Ptd Ltd', date: 'June 1, 2023', amount:'162.82', status: 'OVERDUE', action:'' }
          ];
        data = await sort_asc('id_date'); 
        expect(data).toEqual(output);         
    });
    it("when the user choose 'name', get the data and sort the data with name in descending order", async () => {
        output = [
            { users: 'test12', id: '1016', name: 'Floppy Pte Ltd', date: 'June 15, 2023', amount:'3617.15', status: 'PAID', action:'' },
            { users: 'test12', id: '1015', name: 'Floppy Pte Ltd', date: 'June 14, 2023', amount:'492.90', status: 'PAID', action:'' },
            { users: 'test12', id: '1014', name: 'Floppy Pte Ltd', date: 'June 10, 2023', amount:'853.23', status: 'PAID', action:'' },
            { users: 'test12', id: '1013', name: 'Piong Cha Ptd Ltd', date: 'June 3, 2023', amount:'1242.74', status: 'PAID', action:'' },
            { users: 'test12', id: '1012', name: 'Piong Cha Ptd Ltd', date: 'June 2, 2023', amount:'362.40', status: 'DRAFT', action:'' },
            { users: 'test12', id: '1011', name: 'Piong Cha Ptd Ltd', date: 'June 1, 2023', amount:'162.82', status: 'OVERDUE', action:'' }
          ];
        data = await sort_asc('id_name'); 
        expect(data).toEqual(output);         
    });
    it("when the user choose 'name', get the data and sort the data with name in ascending order", async () => {
        output = [
            { users: 'test12', id: '1013', name: 'Piong Cha Ptd Ltd', date: 'June 3, 2023', amount:'1242.74', status: 'PAID', action:'' },
            { users: 'test12', id: '1012', name: 'Piong Cha Ptd Ltd', date: 'June 2, 2023', amount:'362.40', status: 'DRAFT', action:'' },
            { users: 'test12', id: '1011', name: 'Piong Cha Ptd Ltd', date: 'June 1, 2023', amount:'162.82', status: 'OVERDUE', action:'' },
            { users: 'test12', id: '1016', name: 'Floppy Pte Ltd', date: 'June 15, 2023', amount:'3617.15', status: 'PAID', action:'' },
            { users: 'test12', id: '1015', name: 'Floppy Pte Ltd', date: 'June 14, 2023', amount:'492.90', status: 'PAID', action:'' },
            { users: 'test12', id: '1014', name: 'Floppy Pte Ltd', date: 'June 10, 2023', amount:'853.23', status: 'PAID', action:'' }           
          ];
          data = await sort_des('id_name'); 
        expect(data).toEqual(output); 
    });
    it("when the user choose 'amount', get the data and sort the data with amount in descending order", async () => {
        output = [
            { "users": "test12", "id": "1016", "name": "Floppy Pte Ltd", "date": "June 15, 2023", "amount": "3617.15", "status": "PAID", "action": "" },
            { "users": "test12", "id": "1013", "name": "Piong Cha Ptd Ltd", "date": "June 3, 2023", "amount": "1242.74", "status": "PAID", "action": "" },
            { "users": "test12", "id": "1014", "name": "Floppy Pte Ltd", "date": "June 10, 2023", "amount": "853.23", "status": "PAID", "action": "" },
            { "users": "test12", "id": "1015", "name": "Floppy Pte Ltd", "date": "June 14, 2023", "amount": "492.90", "status": "PAID", "action": "" },
            { "users": "test12", "id": "1012", "name": "Piong Cha Ptd Ltd", "date": "June 2, 2023", "amount": "362.40", "status": "DRAFT", "action": "" },
            { "users": "test12", "id": "1011", "name": "Piong Cha Ptd Ltd", "date": "June 1, 2023", "amount": "162.82", "status": "OVERDUE", "action": "" }
          ];          
          data = await sort_des('id_amount'); 
        expect(data).toEqual(output); 
    });
    it("when the user choose 'amount', get the data and sort the data with amount in ascending order", async () => {
        output = [
            { "users": "test12", "id": "1011", "name": "Piong Cha Ptd Ltd", "date": "June 1, 2023", "amount": "162.82", "status": "OVERDUE", "action": "" },
            { "users": "test12", "id": "1012", "name": "Piong Cha Ptd Ltd", "date": "June 2, 2023", "amount": "362.40", "status": "DRAFT", "action": "" },
            { "users": "test12", "id": "1015", "name": "Floppy Pte Ltd", "date": "June 14, 2023", "amount": "492.90", "status": "PAID", "action": "" },
            { "users": "test12", "id": "1014", "name": "Floppy Pte Ltd", "date": "June 10, 2023", "amount": "853.23", "status": "PAID", "action": "" },
            { "users": "test12", "id": "1013", "name": "Piong Cha Ptd Ltd", "date": "June 3, 2023", "amount": "1242.74", "status": "PAID", "action": "" },
            { "users": "test12", "id": "1016", "name": "Floppy Pte Ltd", "date": "June 15, 2023", "amount": "3617.15", "status": "PAID", "action": "" }
          ];          
        data = await sort_asc('id_amount'); 
        expect(data).toEqual(output);         
    });
});

