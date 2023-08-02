const fetchData = require('../routes/expense');

describe('fetchData', () => {
  it('fetches and processes data correctly for different categories', async () => {
    const fakeRows = [
      { month: 'Jan', total: 100 },
      { month: 'Feb', total: 200 },
      { month: 'Mar', total: 150 },
    ];

    const mockExecute = jest.fn().mockResolvedValue([fakeRows]);
    const mockConnection = {
      execute: mockExecute,
      end: jest.fn(),
    };
    jest.spyOn(require('mysql2/promise'), 'createConnection').mockResolvedValue(mockConnection);

    const result = await fetchData();

    expect(mockExecute).toHaveBeenCalledWith(expect.any(String));
    expect(mockConnection.end).toHaveBeenCalled();

    expect(result).toEqual({
      labels: ['Jan', 'Feb', 'Mar'],
      datasets: [
        {
          label: 'Total Expense Per Month',
          data: [100, 200, 150],
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
        },
      ],
    });
  });

 
});
