const fetchMock = require('fetch-mock');
const {fetchOverdueData } = require('../public/html/chart1'); // Import both functions from chart1.js

describe("test suite for fetchOverdueData", () => {
    beforeEach(() => {
        fetchMock.reset(); // Clear existing mock routes before each test
    });

    test("fetchOverdueData should call createOverdueChart with correct data", async () => {
        const createOverdueChartMock = jest.spyOn(global, 'createOverdueChart'); // Spy on createOverdueChart
        await fetchOverdueData();

        expect(fetchMock.called('/overdue')).toBe(true); // Check if fetch was called with the correct URL
        expect(createOverdueChartMock).toHaveBeenCalledWith(expect.any(Object)); // Check if createOverdueChart was called with an object (or the appropriate data)
    });

    test("fetchOverdueData should log an error when fetch fails", async () => {
        const consoleErrorMock = jest.spyOn(console, 'error'); // Spy on console.error
        fetchMock.get('/overdue', 500); // Mock a failed fetch response
        await fetchOverdueData();

        expect(consoleErrorMock).toHaveBeenCalledWith('Error fetching overdue data:', expect.any(Error)); // Check if console.error was called with the correct error message
    });
});
