// The *real* Single Sign On

var debug = false;

if (debug) {
  console.log("sso_actual.js running");
}

self.port.on("sendCredentials", function(user, pass) {
  if (debug) {
    console.log("receiving credentials!");
  }
  var username = user;
  var password = pass;
  login(username, password);
});

function login (username, password) {
  $('#username').css("disabled", "true");
  $('#password').css("disabled", "true");
  $('#username').val(username);
  $('#password').val(password);
  $('.btn-submit').click();
}

