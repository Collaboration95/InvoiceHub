function fetchOverdueData() {
    fetch('/overdue')
      .then(response => response.json())
      .then(data => createOverdueChart(data))
      .catch(error => console.error('Error fetching overdue data:', error));
  }
  
  function createOverdueChart(data) {
    const ctx = document.getElementById('myChart1').getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.labels,
        datasets: data.datasets,
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }
  
  document.addEventListener('DOMContentLoaded', fetchOverdueData);