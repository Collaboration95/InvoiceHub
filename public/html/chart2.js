const ctx = document.getElementById('barchar2');

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Red', 'Blueeee', 'Yellow', 'Green', 'Purple', 'Orange'],
      datasets: [{
        label: '# of Votes',
        data: [12, 19, 3, 5, 2, 3],
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

