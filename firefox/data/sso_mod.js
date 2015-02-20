// The *real* Single Sign On

var debug = true;

if (debug) {
  console.log("sso_mod.js running");
}

var html = new Object();
html.title = 'Chevaline SSO Aide';

/*
$('#login').css({
  'display': 'inline-box',
  'margin': '10px'
});
*/

var dim = $('#login').offset();
var formWidth = $('#login').css('width');
var formHeight = $('#login').css('height');


html.dialog = ' \
<div id="chevaline_dialog" class="box fl-panel" \
style="\
width: ' + formWidth + '; \
height: ' + formHeight + '; \
background-image: url(' + self.options.background_url + '); \
background: repeat; \
position: absolute; \
left: ' + (dim.left+350) + 'px; \
top: ' + dim.top + 'px; \
color: #A0A0A0; "> \
<img src="' + self.options.background_url + '" /> \
hello! \
</div>';

$('#login').append(html.dialog);

self.port.on("sendCredentials", function(credentials) {
  if (debug) {
    console.log("receiving credentials!");
    console.log("sso_actual, ", credentials[0]);
  }
  var username = credentials[0].username;
  var password = credentials[0].password;
  if (debug) console.log("credentials: " + username + ", " + password);
  login(username, password);
});

function login (username, password) {
  $('#username').css("disabled", "true");
  $('#password').css("disabled", "true");
  $('#username').val(username);
  $('#password').val(password);
  //$('.btn-submit').click();
}
