

function doRequest() {
console.log("running timer.");

var http_request = new XMLHttpRequest();
http_request.open('GET', '/');
http_request.send(null);

$.get('/', function (_data) {
  console.log("get: ", _data);
});

$.post('/', function (_data) {
  console.log("post: ", _data);
});

}

var timer = window.setInterval(doRequest, 15000);
