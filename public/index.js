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