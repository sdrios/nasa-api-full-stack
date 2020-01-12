var req = new XMLHttpRequest();
var url = "https://api.nasa.gov/planetary/apod?api_key=";
var api_key = "RWjbf2gIl6znRHshrHKCPByMufezrNgVbnwrIfbu";

req.open("GET", url + api_key);
req.send();

req.addEventListener("load", function(){
	if(req.status == 200 && req.readyState == 4){
  	var response = JSON.parse(req.responseText);
    document.getElementById("title").textContent = response.title;
    document.getElementById("date").textContent = response.date;
    document.getElementById("pic").src = response.hdurl;
    document.getElementById("explanation").textContent = response.explanation;
  }
})

$('#datepicker').datepicker({
  minDate: new Date(1995, 05, 16),
  maxDate: '0',
  onSelect: function() {
    $('#date-form').submit();
  }
});
