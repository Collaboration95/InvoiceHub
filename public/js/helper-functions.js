//Checked and updated by Ramita and Radhi (11/08)
function DisplayUser(){
    var nameDiv = document.querySelector('.name');
    var positionDiv = document.querySelector('.position');
    nameDiv.innerHTML = localData.user;
    positionDiv.innerHTML = localData.mode;
}


document.addEventListener("DOMContentLoaded", function(event){
    DisplayUser();
  });

