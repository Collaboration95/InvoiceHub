const fetchData = require('../routes/overdue');

describe('fetchData', () => {
  it('fetches and processes data correctly', async () => {
    // Mocking fake rows data
    const fakeRows = [
      { category: '<30 days', count: 5 },
      { category: '30-60 days', count: 10 },
      { category: '60-90 days', count: 15 },
    ];

    // Mocking the MySQL connection and execute functions
    const mockExecute = jest.fn().mockResolvedValue([fakeRows]);
    const mockConnection = {
      execute: mockExecute,
      end: jest.fn(),
    };
    jest.spyOn(require('mysql2/promise'), 'createConnection').mockResolvedValue(mockConnection);

    const result = await fetchData();

    // Assertions
    expect(mockExecute).toHaveBeenCalledWith(expect.any(String));
    expect(mockConnection.end).toHaveBeenCalled();

    expect(result).toEqual({
      labels: ['<30 days', '30-60 days', '60-90 days'],
      datasets: [
        {
          label: 'Amount Overdue',
          data: [5, 10, 15],
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
        },
      ],
    });
  });
});
