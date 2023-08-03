const fetchData = require('../routes/overdue');

describe('fetchData function for Overdue Graph', () => {
  it('fetches and processes data correctly for different categories', async () => {
    const fakeRows = [
      { category: '<30 days', count: 5 },
      { category: '30-60 days', count: 10 },
      { category: '60-90 days', count: 15 },
      { category: '>90 days', count: 5 },
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
      labels: ['<30 days', '30-60 days', '60-90 days', '>90 days'],
      datasets: [
        {
          label: 'Amount Overdue',
          data: [5, 10, 15, 5],
          backgroundColor: [
            'rgba(255, 0, 0, 0.6)',
            'rgba(192, 0, 0, 0.6)',
            'rgba(130, 0, 0, 0.6)',
            'rgba(81, 9, 9, 0.6)'
          ],
          borderColor: [
            'rgba(255, 0, 0, 0.6)',
            'rgba(192, 0, 0, 0.6)',
            'rgba(130, 0, 0, 0.6)',
            'rgba(81, 9, 9, 0.6)'
          ],
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
      { category: '>90 days', count: 0 },
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
      labels: ['<30 days', '30-60 days', '60-90 days', '>90 days'],
      datasets: [
        {
          label: 'Amount Overdue',
          data: [0, 0, 0, 0],
          backgroundColor: [
            'rgba(255, 0, 0, 0.6)',
            'rgba(192, 0, 0, 0.6)',
            'rgba(130, 0, 0, 0.6)',
            'rgba(81, 9, 9, 0.6)'
          ],
          borderColor: [
            'rgba(255, 0, 0, 0.6)',
            'rgba(192, 0, 0, 0.6)',
            'rgba(130, 0, 0, 0.6)',
            'rgba(81, 9, 9, 0.6)'
          ],
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