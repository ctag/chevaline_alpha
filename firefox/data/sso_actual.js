// The *real* Single Sign On

var debug = true;

if (debug) {
  console.log("sso_actual.js running");
}

self.port.on("sendCredentials", function(credentials) {
  if (debug) {
    console.log("receiving credentials!");
  }
  console.log(credentials);
  var username = credentials[0].username;
  var password = credentials[0].password;
  console.log("credentials: " + username + ", " + password);
  login(username, password);
});

function login (username, password) {
  $('#username').css("disabled", "true");
  $('#password').css("disabled", "true");
  $('#username').val(username);
  $('#password').val(password);
  $('.btn-submit').click();
}

