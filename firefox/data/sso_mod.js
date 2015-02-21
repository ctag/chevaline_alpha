// The *real* Single Sign On

var debug = true;

if (debug) {
  console.log("sso_mod.js running");
}

var html = new Object();
var mod = new Object();
mod.title = 'Chevaline SSO Aide';

html.body = $('body');
html.login = $('#login');
html.loginPos = html.login.offset();
html.loginWidth = html.login.width();
html.loginHeight = html.login.height();

html.uselessWarning = $('img[src$="images/warning-icon.png"]').parent();
html.uselessWarning.html("");

mod.padding = '15';
mod.pos = new Object();
mod.pos.left = html.loginPos.left+350;
mod.pos.top = html.loginPos.top;
mod.width = (html.loginWidth - (mod.padding*2) );
mod.height = (html.loginHeight - (mod.padding*2) );

mod.css = '<style> \
.chevaline { \
  font-family: "Lucida Console", Monaco, monospace; \
  font-size: 16px; \
} \
#chevaline_dialog { \
  padding: ' + mod.padding + 'px; \
  width: ' + mod.width + 'px; \
  height: ' + mod.height + 'px; \
  background: url(' + self.options.background_url + ') repeat #111; \
  position: absolute; \
  left: ' + mod.pos.left + 'px; \
  top: ' + mod.pos.top + 'px; \
  color: #E0E0FF; \
} \
</style>';

mod.dialog = ' \
<div id="chevaline_dialog" class="box fl-panel chevaline"> \
<h3>Chevaline Alpha - SSO Aide</h3> \
<hr> \
Please check your configuration options below. \
<br> \
<chevaline_button>Enable Automatic Login</chevaline_button> \
</div>';

mod.ui_css = '<link href="https://code.jquery.com/ui/1.11.3/themes/dark-hive/jquery-ui.css" rel="stylesheet" type="text/css" />';
mod.ui_css_alt = '<link href="' + self.options.jquery_ui_theme_css + '" rel="stylesheet" type="text/css">';
$('head').append(mod.ui_css_alt);

html.login.append(mod.dialog);
html.body.append(mod.css);

$('chevaline_button').button({
  label: "custom"
});

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
