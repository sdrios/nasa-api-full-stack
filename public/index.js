$(document).ready(() => {
  let nasaURL =
    "https://api.nasa.gov/planetary/apod?api_key=gAV3SkyoF0XO00UHGXcOn32RjLQehbeuBqBUo1jE&date=";

  let userDate = $("#datepicker").val();

  //$('#datepicker').val(todayDate);

  //GET REQUEST to Nasa API
  $.ajax({
    url: nasaURL + userDate,
    type: "GET",
    success: data => {
      $("#title").text(data.title);
      $("#date").text(data.date);
      $("#pic").attr("src", data.hdurl);
      $("#explanation").text(data.explanation);
    }
  });

  //User-homepage: Welcome "User"
  var app = require("express")();
  var bodyParser = require("body-parser");

  app.set("view engine", "ejs");

  app.set("views", __dirname + "/views");

  app.use(bodyParser.urlencoded({ extended: false }));

  app.get("/", (req, res) => {
    res.render("homepage");
  });

  app.get("/", (req, res) => {
    res.render("homepage", { username: user });
  });
  
  app.listen(3000, () => {
    console.log("Server online on http://localhost:3000");
  });

});
