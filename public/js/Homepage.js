//final checked by ramita and radhi (11/08)
let expenseChart = null;
let overdueChart = null;

// Fetching data values such as Date, Total and Status from Database
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
// Create Overdue Bar Graph using the fetched values
function createOverdueChart(data) {
  const ctx = document.getElementById('myChart1').getContext('2d');
  const labels = ['<30 days', '30-60 days', '60-90 days', '>90 days'];
  return new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
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
// Fetching data values such as Date, Total and Status from Database
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
// Create Expense Line Graph using the fetched values
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
// Update value for Total Outstanding upon fetching the summed value
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

// Update value for Total Due upon fetching the summed value
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

// Update value for Total Overdue upon fetching the summed value
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
