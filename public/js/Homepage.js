let expenseChart = null;
let overdueChart = null;

function fetchOverdueData() {
  fetch('/homepage/fetch-overdue-data')
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

document.addEventListener('DOMContentLoaded', fetchOverdueData);

function fetchExpenseData() {
  fetch('/homepage/fetch-expense-data')
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

document.addEventListener('DOMContentLoaded', fetchExpenseData);

function updateTotalOutstanding() {
  fetch("/homepage/fetch-total-outstanding")
      .then(response => response.text())
      .then(data => {
          document.getElementById("total_value").textContent = data;
      })
      .catch(error => {
          console.error("Error fetching data:", error);
          document.getElementById("total_value").textContent = "Error loading data";
      });
}

document.addEventListener('DOMContentLoaded', updateTotalOutstanding);


function updateTotalDue() {
  fetch("/homepage/fetch-total-due")
      .then(response => response.text())
      .then(data => {
          document.getElementById("total_due_value").textContent = data;
      })
      .catch(error => {
          console.error("Error fetching data:", error);
          document.getElementById("total_due_value").textContent = "Error loading data";
      });
}

document.addEventListener('DOMContentLoaded', updateTotalDue);


function updateTotalOverdue() {
  fetch("/homepage/fetch-total-overdue")
      .then(response => response.text())
      .then(data => {
          document.getElementById("total_overdue_value").textContent = data;
      })
      .catch(error => {
          console.error("Error fetching data:", error);
          document.getElementById("total_overdue_value").textContent = "Error loading data";
      });
}

document.addEventListener('DOMContentLoaded', updateTotalOverdue);
