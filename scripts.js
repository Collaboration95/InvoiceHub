function load(id){
  document.getElementById("Data Table2").innerHTML=localStorage.getItem(id);
  document.getElementById("Data Table2").style.textAlign = "center";
}

function showNotifications(id){
  var table = document.getElementById(id);
  var length = table.rows.length;
  var message = "";
  for (let j = length-1; j >= 0;j--) {
      var supplier = document.getElementById("Data Table2").rows[j].cells[2].innerHTML;
      if (/^[A-Za-z\s]*$/.test(supplier)) {
          var status = document.getElementById(id).rows[j].cells[4].innerHTML;
          var date = document.getElementById(id).rows[j].cells[3].innerHTML;
          var ref = document.getElementById(id).rows[j].cells[1].innerHTML;
          var line = "Payment DUE " + date + " for " + supplier + "\n REF NO. " + ref + "\n";
          message = message + line;
      }; 
                          
  };
  new Notification(message);
}

function Add(id){
  var table = document.getElementById(id);
  var length = table.rows.length;
  var newRow = table.insertRow(length);
  newRow.insertAdjacentHTML('beforeEnd', "<td> <div class='form-control'><input type='checkbox' id='checkbox' checked='false' >  </div></td>");   //add checkbox

  var cell1 = newRow.insertCell(1);//add new cells
  cell1.innerHTML = "<br>";

  var cell2 = newRow.insertCell(2);
  cell2.innerHTML = "<br>";

  var cell3 = newRow.insertCell(3);
  var d = new Date();
  let day = d.getDate();
  let month = d.getMonth();
  let year = d.getFullYear();
  cell3.innerHTML = `${day}-${month}-${year}`;

  var cell4 = newRow.insertCell(4);
  cell4.innerHTML = "PENDING";

  var cell5 = newRow.insertCell(5);
  cell5.innerHTML = '<br>';
}

function Delete(id) {
  var table = document.getElementById(id);
  var length = table.rows.length - 1;
  if (length == 0) {
      alert("There are no reminders to delete");
  }
  if (length == 1) {
      var cb = document.querySelector('#checkbox');
      if (cb.checked == true) {
          table.deleteRow(1);
      };
  }
  else {
      for (let i = length; i > 0; i--) {
          var cb = document.getElementById("Data Table2").rows[i].querySelector("#checkbox");
          if (cb.checked == true) {
              table.deleteRow(i);
          };
      };
  };
}

function Save(){
  if (confirm('Save?')) {
    localStorage.setItem("Data Table2", document.getElementById("Data Table2").innerHTML);
    alert("Changes Saved!");
  };
}

