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
      const oneWeekLeft = await fetch('/notification/get-unpaid-invoices-7');
      const threeDaysLeft = await fetch('/notification/get-unpaid-invoices-3');
      const OverDue = await fetch('/notification/get-unpaid-invoices-7');
      const data1 = await oneWeekLeft.json();
      data1.forEach(invoice => {
        // set days left on payment
        invoice.daysLeft = 'due in 3 days.';
      });
      const data2 = await threeDaysLeft.json();
      data1.forEach(invoice => {
        // set days left on payment
        invoice.daysLeft = 'due in a week.';
      });
      const data3  = await OverDue.json();
      data1.forEach(invoice => {
        // set days left on payment
        invoice.daysLeft = 'overdue.';
      });
      const data = [...data1,...data2,...data3];
      return data;
    } catch (error) {
      console.error('Error fetching invoices data:', error);
    }
  }



    









  // load list of events to display (in the past week) when clicked [fake data for now] x
  // generate containers for each event x
  // wrap the events in the box (box exists in html?) fix box size x
  // add ability to scroll to view more events x
  //  CSS
  // remove the scrolling bar thing if its default x
  // add hover function for bell x
  // style the fonts and size for the timing plus event x
  // style box? x
  // connect to db and figuire out how to retrive the events fom db instead of the fake shiz