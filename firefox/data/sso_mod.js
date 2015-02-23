// The *real* Single Sign On

var debug = false;

if (debug) {
  console.log("sso_mod.js running");
}

var html = new Object();
var mod = new Object();

var ssoEnabled = self.options.sso_enabled;
var ssoTimeout = self.options.sso_timeout;
var ssoTimeoutPeriod = 200;
var ssoUsername = "";

self.port.on('send_ssoCredential', function (_credential) {
  //ssoUsername = _credential.username;
  console.log("username: ", _credential.username);
  if (_credential.username) {
    html.inputUsername.val(_credential.username);
  } else {
    html.inputUsername.val('No Username Found :|');
  }
  if (_credential.password) {
    html.inputPassword.val(_credential.password);
  }
})

if (self.options.sso_enabled && (!$('.errors')[0])) {
  console.log("requesting credential from main.js");
  self.port.emit('request_ssoCredential');
}

if (debug) console.log(ssoEnabled);
if (debug) console.log(self.options.sso_enabled);

if (ssoEnabled) {
  var ssoTimer = window.setInterval(countdown, ssoTimeoutPeriod);
}


html.uselessWarning = $('img[src$="images/warning-icon.png"]').parent();
html.uselessWarning.html("");

html.uselessQuestion = $("p:contains('What is Single-Sign on')");
html.uselessQuestion.html("Why does this page look different?");

html.uselessDescription = $("p:contains('centralized, easy-to-use login system')");
html.uselessDescription.html('Chevaline Alpha is running a content-script on this login page in order to aid \
you logging in. Rather than make empty promises, we encourage you to browse the \
<a href="http://berocs.com">source code</a> to the plugin \
and see for yourself that it does not pose a substantial threat to your account\'s security.');

html.body = $('body');
html.login = $('#login');
html.loginPos = html.login.offset();
html.loginWidth = html.login.width();
html.loginHeight = html.login.height();
html.inputUsername = $('#username');
html.inputPassword = $('#password');

html.inputUsername.attr('autocomplete', 'on');
html.inputPassword.attr('autocomplete', 'on');

mod.padding = 15;
mod.pos = new Object();
mod.pos.left = html.loginPos.left+350;
mod.pos.top = html.loginPos.top;
mod.borderWidth = 2;
mod.width = (html.loginWidth - (mod.padding*2) - (mod.borderWidth*2) );
mod.height = (html.loginHeight - (mod.padding*2) - (mod.borderWidth*2) );

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
  border: ' + mod.borderWidth + 'px solid #353590; \
} \
</style>';

mod.dialog = ' \
<div id="chevaline_dialog" class="box fl-panel chevaline"> \
<h3 style="text-align: center;">Chevaline Alpha - SSO Aide</h3> \
<hr> \
<center> \
Configuration options \
<br><br> \
<input type="checkbox" id="chevaline_autologin_enable"><label id="chevaline_autologin_enable_label" for="chevaline_autologin_enable">Enable Automatic Login</label> \
<br> \
<div style="margin-top: 5px; margin-bottom: 5px;"> \
Set SSO Credentials \
<br> \
Username <input type="text" id="chevaline_sso_username" size="10"> \
Password <input type="password" id="chevaline_sso_password" size="10"> \
</div> \
<br> \
<input type="button" id="chevaline_sso_submit" value="Save"> \
<div id="chevaline_timer"> \
</div> \
</center></div>';

//mod.theme_css = '<link href="https://code.jquery.com/ui/1.11.3/themes/dark-hive/jquery-ui.css" rel="stylesheet" type="text/css" />';
mod.theme_css = '<link href="' + self.options.jquery_ui_theme_css + '" rel="stylesheet" type="text/css">';
$('head').append(mod.theme_css);

mod.ui_css = '<link href="' + self.options.jquery_ui_css + '" rel="stylesheet" type="text/css">';
$('head').append(mod.ui_css);

html.login.append(mod.dialog);
html.body.append(mod.css);

if (ssoUsername) {
  html.inputUsername.val(ssoUsername);
}

mod.buttonEnable = $('#chevaline_autologin_enable');
mod.buttonEnable.button();
mod.buttonSubmit = $('#chevaline_sso_submit');
mod.buttonSubmit.button();

mod.inputPassword = $('#chevaline_sso_password');
mod.inputUsername = $('#chevaline_sso_username');

mod.buttonEnable.click(function handleClick () {
  var _enabled = mod.buttonEnable.prop('checked');
  if (debug) console.log("clicked: ", _enabled);
  self.port.emit('return_ssoEnabled', _enabled);
  sso_enabled = _enabled;
});

mod.buttonSubmit.click(function handleClick () {
  if (mod.inputUsername.val() && mod.inputPassword.val()) {
    self.port.emit('return_ssoCredentials', mod.inputUsername.val(), mod.inputPassword.val());
  }
});

function set_buttonEnable ()
{
  if (self.options.sso_enabled) {
    mod.buttonEnable.prop('checked', 'true').button('refresh');
  } else {
    mod.buttonEnable.prop('checked', 'false').button('refresh');
  }
}

function login (username, password) {
  if (html.inputUsername.val() && html.inputPassword.val()) {
    $('.btn-submit').click();
  }
}

function countdown (_period) {
  var _time = $('#chevaline_timer');
    console.log(_time.html());
    ssoTimeout = ssoTimeout - ssoTimeoutPeriod;
    if (ssoTimeout < 0) {
      _time.html("0ms");
      window.clearInterval(ssoTimer);
      login();
    } else {
      _time.html(ssoTimeout + "ms");
    }
}

// On run:
set_buttonEnable();
