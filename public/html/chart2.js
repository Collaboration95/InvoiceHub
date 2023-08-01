function fetchExpenseData() {
  fetch('/expense')
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