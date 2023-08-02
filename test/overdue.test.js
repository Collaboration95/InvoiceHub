const fetchData = require('../routes/overdue');

describe('fetchData', () => {
  it('fetches and processes data correctly for different categories', async () => {
    const fakeRows = [
      { category: '<30 days', count: 5 },
      { category: '30-60 days', count: 10 },
      { category: '60-90 days', count: 15 },
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

  it('fetches and processes data correctly with no rows returned', async () => {
    const fakeRows = [
      { category: '<30 days', count: 0 },
      { category: '30-60 days', count: 0 },
      { category: '60-90 days', count: 0 },
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
      labels: ['<30 days', '30-60 days', '60-90 days'],
      datasets: [
        {
          label: 'Amount Overdue',
          data: [0,0,0],
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
        },
      ],
    });
  });

  it('handles error when fetching data', async () => {
    const errorMessage = 'Database connection error';
    const mockExecute = jest.fn().mockRejectedValue(new Error(errorMessage));
    const mockConnection = {
      execute: mockExecute,
      end: jest.fn(),
    };
    jest.spyOn(require('mysql2/promise'), 'createConnection').mockResolvedValue(mockConnection);

    try {
      await fetchData();
    } catch (error) {
      expect(error.message).toBe(errorMessage);
    }

    expect(mockExecute).toHaveBeenCalledWith(expect.any(String));
    expect(mockConnection.end).not.toHaveBeenCalled();
  });
});









