const ctx2 = document.getElementById('barchar1');

  new Chart(ctx2, {
    type: 'bar',
    data: {
      labels: ['<30 days', '30-60 days', '60-90 days'],
      datasets: [{
        label: 'Amount Overdue',
        data: [1397, 4580, 3004, 305],
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });