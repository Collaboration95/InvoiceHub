function fetchOverdueData() {
    fetch('/invoice/fetch-overdue-data')
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

  function fetchExpenseData() {
    fetch('/invoice/fetch-expense-data')
      .then(response => response.json())
      .then(data => createExpenseChart(data))
      .catch(error => console.error('Error fetching expense data:', error));
  }
  
  function createExpenseChart(data) {
    const ctx = document.getElementById('myChart').getContext('2d');
    new Chart(ctx, {
      type: 'line',
      data: data,
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }
  
  document.addEventListener('DOMContentLoaded', fetchExpenseData);
  document.addEventListener('DOMContentLoaded', function(){
    fetchExpenseData();
    fetchOverdueData();
  });