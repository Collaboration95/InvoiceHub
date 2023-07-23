// Function to fetch JSON data from the barchart.php script
function fetchData() {
    fetch('barchart.php')
      .then(response => response.json())
      .then(data => createChart(data))
      .catch(error => console.error('Error fetching data:', error));
  }
  
  // Function to create the chart using the fetched data
  function createChart(data) {
    const ctx = document.getElementById('myChart').getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: data,
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
  
  // Call the fetchData function to get the data and create the chart
  fetchData();
  