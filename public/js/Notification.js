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
    createNotif(notifs, "New Notification6", "10 minutes ago");
    createNotif(notifs, "New Notification5", "20 minutes ago");
    createNotif(notifs, "New Notification4", "30 minutes ago");
    createNotif(notifs, "New Notification3", "40 minutes ago");
    createNotif(notifs, "New Notification2", "50 minutes ago");
    createNotif(notifs, "New Notification1", "50 minutes ago");
    dd_menu.classList.toggle('menu-open');
    })
})




    









  // load list of events to display (in the past week) when clicked [fake data for now] x
  // generate containers for each event  
  // wrap the events in the box (box exists in html?) fix box size x
  // add ability to scroll to view more events x
  //  CSS
  // remove the scrolling bar thing if its default x
  // add hover function for bell 
  // style the fonts and size for the timing plus event 
  // style box? x
  // connect to db and figuire out how to retrive the events fom db instead of the fake shiz