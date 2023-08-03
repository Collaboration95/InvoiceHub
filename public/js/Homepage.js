let expenseChart = null;
let overdueChart = null;

function fetchOverdueData() {
  fetch('/invoice/fetch-overdue-data')
    .then(response => response.json())
    .then(data => {
      if (overdueChart) {
        overdueChart.destroy();
      }
      overdueChart = createOverdueChart(data);
    })
    .catch(error => console.error('Error fetching overdue data:', error));
}

function createOverdueChart(data) {
  const ctx = document.getElementById('myChart1').getContext('2d');
  return new Chart(ctx, {
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
    .then(data => {
      if (expenseChart) {
        expenseChart.destroy();
      }
      expenseChart = createExpenseChart(data);
    })
    .catch(error => console.error('Error fetching expense data:', error));
}

function createExpenseChart(data) {
  const ctx = document.getElementById('myChart').getContext('2d');
  return new Chart(ctx, {
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

document.addEventListener('DOMContentLoaded', function () {
  fetchExpenseData();
  fetchOverdueData();
});


module.exports = {fetchExpenseData, fetchOverdueData};