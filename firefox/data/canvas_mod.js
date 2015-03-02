//
// Canvas_mod
//

/*
 * Setup
 */


var debug = self.options.debug;
var cleanupPage = self.options.cleanup_page;
var extendSession = self.options.extend_session;
var mod = new Object();

/*
 * Functions
 */

function do_cleanupPage () {
  // Don't store elements in variables, because we should only need to latch once.
  // Get rid of "use our app" advertisements.
  $("meta:contains('apple-itunes-app')").remove();
  $("meta:contains('google-play-app')").remove();
  // Get rid of the javascript banner.
  $("noscript:contains('You need to have JavaScript')").remove();
}

function do_injectCSS () {
  mod.theme_css = '<link href="' + self.options.jquery_ui_theme_css + '" rel="stylesheet" type="text/css">';
  //$('head').append(mod.theme_css);

  mod.ui_css = '<link href="' + self.options.jquery_ui_css + '" rel="stylesheet" type="text/css">';
  $('head').append(mod.ui_css);
}

// From what we know:
// There is a 10 hour hard cap for session life
// There is a 2 hour inactivity cap which is not extended with ajax requests
// There is a bug which provokes varied <2hr logouts against the user's wishes

function printResponse(e) {
  console.log(this, e);
}

function do_request() {
  //console.log("running timer.");

  var token = 'Bearer <token>';

  var http_request = new XMLHttpRequest();
  http_request.onload = printResponse;
  http_request.open('POST', 'https://canvas.instructure.com/api/v1/courses', false);
  http_request.setRequestHeader("Authorization", token);
  http_request.send();
  console.log(http_request.responseText);

  console.log("making request " + token);
  var results = $.ajax({
    type: "GET",
    url: "https://canvas.instructure.com/api/v1/courses?access_token=<token>",
    /*beforeSend: function (xhr) {
      xhr.setRequestHeader("Authorization", token);
    },*/
    dataType: 'jsonp',
    success: function (response) {
      console.log("successfdsfds: ", response);
    }
  }).done( function (some) {
    console.log("done: ", some);
  });

  console.log("after: ", results.getResponseHeader);

  /*
  $.get('https://uah.instructure.com/dashboard-sidebar', function (_data) {
    //console.log("get: ", _data);
  });

  $.post('https://uah.instructure.com/dashboard-sidebar', function (_data) {
    //console.log("post: ", _data);
  });
  */
}

/*
 * Execution
 */
$(document).ready(function () {
  if (cleanupPage) {
    do_cleanupPage();
  }
  do_injectCSS();
  /*
  if (extendSession) {
    // Set query for every 15 minutes
    var timer = window.setInterval(do_request, 900000);
  }
  */
  //do_request();
}); // end document.ready()
