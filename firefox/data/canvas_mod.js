
function printResponse (e) {
  console.log(this, e);
}

function doRequest() {
console.log("running timer.");

/*
var http_request = new XMLHttpRequest();
http_request.onload = printResponse;
http_request.open('GET', 'https://uah.instructure.com/', true);
http_request.send();
*/

$.ajax({
  type: "GET",
  url: "https://uah.instructure.com/"
}).done(function (e) {
  console.log(e);
});

/*
$.get('https://uah.instructure.com/dashboard-sidebar', function (_data) {
  //console.log("get: ", _data);
});

$.post('https://uah.instructure.com/dashboard-sidebar', function (_data) {
  //console.log("post: ", _data);
});
*/

}

// Set query for every 15 minutes
var timer = window.setInterval(doRequest, 9000/*00*/);
