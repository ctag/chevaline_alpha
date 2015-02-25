// Get rid of "use our app" advertisements.
$("meta:contains('apple-itunes-app')").remove();
$("meta:contains('google-play-app')").remove();

// Get rid of the super fucking annoying javascript banner.
$("noscript:contains('You need to have JavaScript')").remove();

// Everything below here is for testing session extension
// From what we know:
// There is a 10 hour hard cap for session life
// There is a 2 hour inactivity cap which is not extended with ajax requests
// There is a bug which provokes varied <2hr logouts against the user's wishes

function printResponse(e) {
  //console.log(this, e);
}

function doRequest() {
  //console.log("running timer.");

  /*
  var http_request = new XMLHttpRequest();
  http_request.onload = printResponse;
  http_request.open('GET', 'https://uah.instructure.com/', true);
  http_request.send();
  */

  $.ajax({
    type: "GET",
    url: "https://uah.instructure.com/"
  }).done(function(e) {
    //console.log(e);
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
//var timer = window.setInterval(doRequest, 9000/*00*/);
