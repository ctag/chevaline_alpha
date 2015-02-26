// The *real* Single Sign On

/*
 * Setup
 */

// Unlike with simplePrefs, we have to keep up with this value manually, since self.options is static.
var debug = self.options.debug;
var ssoEnabled = self.options.sso_enabled;
var ssoTimeout = self.options.sso_timeout;
var ssoTimeoutPeriod = 200;
var ssoTimer = false;
var html = new Object(); // Associate elements already on page
var mod = new Object(); // Associate elements created by this js

if (debug) console.log("sso_mod.js loading.");

/*
 * Functions
 */

function create_buttons() {
  mod.buttonEnable.button();

  mod.buttonEnable.click(function handleClick() {
    ssoEnabled = mod.buttonEnable.prop('checked');
    if (debug) console.log("clicked: ", ssoEnabled);
    self.port.emit('return_ssoEnabled', ssoEnabled);
    set_buttons();
  });

  mod.buttonDocs.button();
  self.port.emit('request_ssoEnabled');
}

function set_buttons() {
  //mod.buttonEnable.button();
  var _text = "Automatic Login ";
  if (ssoEnabled) {
    _text += "Enabled";
  } else {
    _text += "Disabled";
  }
  mod.buttonEnable.prop('checked', ssoEnabled);
  mod.buttonEnable.button('option', 'label', _text);
  mod.buttonEnable.button("refresh");
}

function login(username, password) {
  if ($('.errors')[0]) {
    return; // Don't try logging in if there's an auth failure.
  }
  if (html.inputUsername.val() && html.inputPassword.val()) {
    $('.btn-submit').click();
  }
}

function countdown(_period) {
  var _time = $('#chevaline_timer');
  if (debug) console.log(_time.html());
  ssoTimeout = ssoTimeout - ssoTimeoutPeriod;
  if (ssoTimeout < 0) {
    _time.html("0ms");
    window.clearInterval(ssoTimer);
    login();
  } else {
    _time.html(ssoTimeout + "ms");
  }
}

/*
 * Ports
 */

self.port.on('send_ssoEnabled', function(_enabled) {
  ssoEnabled = _enabled;
  set_buttons();
});

self.port.on('send_ssoCredential', function(_credential) {
  //ssoUsername = _credential.username;
  if (debug) console.log("username: ", _credential.username);
  if (_credential.username) {
    html.inputUsername.val(_credential.username);
  } else {
    html.inputUsername.val('No Username Found :|');
    html.inputUsername.click(function() {
      $(this).val('');
    });
    return; // Don't even try filling the password.
  }
  if (_credential.password) {
    html.inputPassword.val(_credential.password);
  }
})

if (ssoEnabled && (!$('.errors')[0])) {
  if (debug) console.log("requesting credential from main.js");
  self.port.emit('request_ssoCredential');
}

/*
 * Execution
 */
$(document).ready(function() {

  if (ssoEnabled && !debug) {
    ssoTimer = window.setInterval(countdown, ssoTimeoutPeriod);
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
  mod.pos.left = html.loginPos.left + 350;
  mod.pos.top = html.loginPos.top;
  mod.borderWidth = 2;
  mod.width = (html.loginWidth - (mod.padding * 2) - (mod.borderWidth * 2));
  mod.height = (html.loginHeight - (mod.padding * 2) - (mod.borderWidth * 2));

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
<br> \
<a href="https://github.com/ctag/chevaline_alpha" target="_blank" id="chevaline_button_docs">omg, wat do?</a> \
<div id="chevaline_timer"> \
</div> \
</center></div>';

  mod.theme_css = '<link href="' + self.options.jquery_ui_theme_css + '" rel="stylesheet" type="text/css">';
  $('head').append(mod.theme_css);

  mod.ui_css = '<link href="' + self.options.jquery_ui_css + '" rel="stylesheet" type="text/css">';
  $('head').append(mod.ui_css);

  html.login.append(mod.dialog);
  html.body.append(mod.css);

  mod.buttonEnable = $('#chevaline_autologin_enable');
  mod.buttonDocs = $('#chevaline_button_docs');

  mod.buttonDocs.ready(function() {
    mod.buttonEnable.ready(function() {
      create_buttons();
    });
  });

}); // end .ready()
