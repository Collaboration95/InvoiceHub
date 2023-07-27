// const ctx = document.getElementById('barchar2');

// new Chart(ctx, {
//   type: 'line',
//   data: {
//     labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
//     datasets: [{
//       label: 'Total Expense per Month',
//       data: [25000, 12598, 14104, 50394, 40293, 54709, 80274, 15349, 10410, 75243, 142324, 62245],
//       borderWidth: 1
//     }]
//   },
//   options: {
//     scales: {
//       y: {
//         beginAtZero: true
//       }
//     }
//   }
// });


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
