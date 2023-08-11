//checked and updated by ramit and radhi (11/08)
const bell = document.getElementById("notification-bell");
var notifs = document.getElementById("dropdown-items");

// given the notification informatio(p_value) and timing info(span_value) create an event to display
function createNotif(menu,p_value, span_value) {    
    var li = document.createElement("li"); 
    var cont = document.createElement('div'); 
    var p = document.createElement('p');
    p.textContent = p_value;
    var span = document.createElement('span');
    span.textContent = span_value;    
    cont.appendChild(p);
    cont.appendChild(span);
    li.appendChild(cont);
    menu.appendChild(li); 
         
}

const dropdown = document.querySelectorAll('.notification')
dropdown.forEach(notifications => {
       
    //const dd_menu = notifications.querySelector('.menu');  
    const dd_menu = notifs.closest('.menu'); 
    bell.addEventListener('click', ()=> {
    getData();
    data.forEach(invoice => {
        const id = invoice.invoiceid;
        const total = invoice.invoice.total;
        const dleft = invoice.daysLeft;
        var event = id +  " of " +  total + " is " + dleft ;
        var time = "10 minutes ago";

        createNotif(notifs, event, time);
    });
    dd_menu.classList.toggle('menu-open');
    })
})
// return an array witth invoice objects that have invoiceid, invoice_name, upload_date, total, status, daysLeft
async function getData() {
  try {
    const response = await fetch('/notification/fetch-overdue-data'); // Change the endpoint to match your combined route
    const data = await response.json();

    data.forEach(invoice => {
      if (invoice.daysLeft === 23) {
        invoice.daysLeft = 'due in a week.';
      } else if (invoice.daysLeft === 27) {
        invoice.daysLeft = 'due in 3 days.';
      } else if (invoice.daysLeft >= 30) {
        invoice.daysLeft = 'overdue.';
      }
    });

    return data;
  } catch (error) {
    console.error('Error fetching invoices data:', error);
  }
}