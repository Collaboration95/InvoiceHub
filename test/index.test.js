// login.test.js
const fetchMock = require('jest-fetch-mock');
const validateLogin  = require('../public/index'); // Replace './your-module' with the correct path to your module

// Mock the fetch function
global.fetch = fetchMock;

describe('validateLogin', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  it('should handle successful login', async () => {
    // Mock the response from the server
    const mockData = { userId: 123, username: 'john_doe' };
    fetch.mockResponseOnce(JSON.stringify(mockData));

    // Call the function
    await validateLogin('john_doe', 'secret');

    // Assertions
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith('/account/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: 'john_doe', password: 'secret' }),
    });
    expect(sessionStorage.getItem('localData')).toBe(JSON.stringify(mockData));
    expect(window.location.href).toBe('html/HomePage.html');
    expect(window.alert).not.toHaveBeenCalled();
  });

  it('should handle invalid login', async () => {
    // Mock the response from the server (empty response data for invalid login)
    fetch.mockResponseOnce(JSON.stringify({}));

    // Mock the alert function
    window.alert = jest.fn();

    // Call the function
    await validateLogin('invalid_user', 'invalid_password');

    // Assertions
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith('/account/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: 'invalid_user', password: 'invalid_password' }),
    });
    expect(sessionStorage.getItem('localData')).toBeNull();
    expect(window.location.href).toBe('');
    expect(window.alert).toHaveBeenCalledWith('Invalid username or password');
  });
});
