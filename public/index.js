var req = new XMLHttpRequest();
var url = "https://api.nasa.gov/planetary/apod?api_key=";
var api_key = "RWjbf2gIl6znRHshrHKCPByMufezrNgVbnwrIfbu";

req.open("GET", url + api_key );
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

import { mdbDatePicker, mdbSpinner, mdbBtn } from "mdbvue";

export default {
  name: "Example",
  components: {
    mdbDatePicker,
    mdbSpinner,
    mdbBtn
  },
  methods: {
    getPickerValue(pickerValue) {
      var queryUrl = "https://api.nasa.gov/planetary/apod?";
      var queryKey = "api_key=RWjbf2gIl6znRHshrHKCPByMufezrNgVbnwrIfbu";
      var queryDate = "date=" + pickerValue + "&";
      var queryFull = queryUrl + queryKey + queryDate;

      axios
        .get(queryFull)
        .then(response => {
          (this.date = response.data.date),
            (this.explanation = response.data.explanation),
            (this.media_type = response.data.media_type),
            (this.title = response.data.title),
            (this.url = response.data.url)((this.hdurl = response.data.hdurl));
        })
        .catch(error => {
          console.log(error);
          this.errored = true;
        })
        .finally(() => (this.loading = false));
    }
  },
        
      loading: true,
      errored: false,
      date: null,
      explanation: null,
      media_type: null,
      title: null,
      url: null,
      hdurl: null,
      selected: "",
      today: null
    };
  

  mounted() 
    var queryUrl = "https://api.nasa.gov/planetary/apod?";
    var queryKey = "api_key=RWjbf2gIl6znRHshrHKCPByMufezrNgVbnwrIfbu";
    var queryDate = "";
    var queryFull = queryUrl + queryKey + queryDate; 

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); 
    var yyyy = today.getFullYear();

    this.today = yyyy + "-" + mm + "-" + dd;

    axios
      .get(queryFull)
      .then(response => {
        (this.date = response.data.date),
          (this.explanation = response.data.explanation),
          (this.media_type = response.data.media_type),
          (this.title = response.data.title),
          (this.url = response.data.url)((this.hdurl = response.data.hdurl));
      })
      .catch(error => {
        console.log(error);
        this.errored = true;
      })
      .finally(() => (this.loading = false));