// var table = document.getElementById("invoice_table");

// // Function to fetch data from the server
// async function getData() {
//   try {
//     const response = await fetch('/invoice/table');
//     const data = await response.json();
//     data.forEach(invoice => {
//       // Determine statusColor based on status
//       if (invoice.status.toUpperCase() === 'DRAFT') {
//         invoice.statusColor = '#acacac';
//       } else if (invoice.status.toUpperCase() === 'OVERDUE') {
//         invoice.statusColor = 'rgb(252, 183, 137)';
//       } else if (invoice.status.toUpperCase() === 'PAID') {
//         invoice.statusColor = 'rgb(136, 197, 136)';
//       }
//     });
//     return data;
//   } catch (error) {
//     console.error('Error fetching invoices data:', error);
//   }
// }

// // Function to render the table with data
// function renderTable(data) {
//   // set up the title of each column
//   table.innerHTML = `
//     <tr>
//       <th>ID</th>
//       <th>INVOICE NAME</th>
//       <th>INVOICE DATE</th>
//       <th>AMOUNT</th>
//       <th>STATUS</th>
//     </tr>
//   `;
//   // Render each row of data
//   data.forEach(invoice => {
//          invoice.upload_date = new Date(invoice.upload_date);
//         const options = { timeZone: 'Asia/Singapore' };
//         invoice.upload_date = (invoice.upload_date).toLocaleDateString('en-SG', options);

//         // var for saving the status' color column
//         var statusColor = "";
//         var status = invoice.status.toUpperCase();

//         // classify the color for each status
//         if (status === "DRAFT") {
//           statusColor = "#acacac";
//         } else if (status === "OVERDUE") {
//           statusColor = "rgb(252, 183, 137)";
//         } else if (status === "PAID") {
//           statusColor = "rgb(136, 197, 136)";
//         }

//         // render each row of data
//         table.innerHTML += `
//           <tr>
//             <td>${invoice.invoiceid}</td>
//             <td>${invoice.invoice_name}</td>
//             <td>${invoice.upload_date}</td>
//             <td>$S ${invoice.total}</td>
//             <td style="background-color: ${statusColor};">${status}</td>
//           </tr>`;
//   });
// }

// // Call getData() and renderTable() when the page loads
// document.addEventListener('DOMContentLoaded', () => {
//   getData().then(data => renderTable(data));
// });
