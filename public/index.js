$(document).ready(() => {

  let nasaURL = 'https://api.nasa.gov/planetary/apod?api_key=gAV3SkyoF0XO00UHGXcOn32RjLQehbeuBqBUo1jE&date='

  let userDate = $('#datepicker').val();
  
  //$('#datepicker').val(todayDate);

  //GET REQUEST to Nasa API 
  $.ajax({
    url: nasaURL + userDate,
    type: 'GET',
    success: (data) => {

      $('#title').text(data.title);
      $('#date').text(data.date);
      $("#pic").attr('src', data.hdurl);
      $("#explanation").text(data.explanation);
    }
  });


});


// var req = new XMLHttpRequest();
// var url = "https://api.nasa.gov/planetary/apod?api_key=";
// var api_key = "RWjbf2gIl6znRHshrHKCPByMufezrNgVbnwrIfbu";

// var datePick = document.getElementById('datepicker');
// datePick.max = todaysDate();
// datePick.value = todaysDate();
// var date = datePick.value;

// var url = 'https://api.nasa.gov/planetary/apod?api_key=' + API_KEY + '&date=' + date;

// req.open("GET", url + api_key );
// req.send();

// req.addEventListener("load", function(){
// 	if(req.status == 200 && req.readyState == 4){
//   	var response = JSON.parse(req.responseText);
//     document.getElementById("title").textContent = response.title;
//     document.getElementById("date").textContent = response.date;
//     document.getElementById("pic").src = response.hdurl;
//     document.getElementById("explanation").textContent = response.explanation;
//     document.getElementById("datepicker").src =response.hdurl;
//   }
// })
