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
    //$('.btn-submit').click();
    console.log("click!");
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

function set_timer() {
  if (debug) console.log("Setting login timer to "+ssoEnabled+".");
  if (ssoEnabled && (typeof(ssoTimer) === 'boolean')) {
    ssoTimer = window.setInterval(countdown, ssoTimeoutPeriod);
  } else if (!ssoEnabled) {
    window.clearInterval(ssoTimer);
  }
}

/*
 * Ports
 */

self.port.on('send_ssoEnabled', function(_enabled) {
  ssoEnabled = _enabled;
  set_timer();
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

/*
 * Execution
 */

$(document).ready(function() {
  if (debug) console.log("sso_mod.js loading.");
  if (debug) console.log("sso_enabled is set to [" + ssoEnabled + "].");

  if (ssoEnabled && (!$('.errors')[0])) {
    if (debug) console.log("Requesting credential from main.js.");
    self.port.emit('request_ssoCredential');
  }

  html.body = $('body');
  html.login = $('#login');
  html.loginPos = html.login.offset();
  html.inputUsername = $('#username');
  html.inputPassword = $('#password');

  html.inputUsername.attr('autocomplete', 'on');
  html.inputPassword.attr('autocomplete', 'on');

  mod.padding = 15;
  mod.pos = new Object();
  mod.pos.left = html.loginPos.left + 350;
  mod.pos.top = html.loginPos.top;
  mod.borderWidth = 2;
  mod.width = 300;
  mod.height = 300;

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
  border: ' + mod.borderWidth + 'px solid #0005b6; \
} \
</style>';

  mod.dialog = ' \
<div id="chevaline_dialog" class="chevaline-ui box fl-panel chevaline"> \
<h3 style="text-align: center;">Chevaline Alpha - SSO Aide</h3> \
<hr> \
<center> \
Configuration options \
<br><br> \
<input type="checkbox" id="chevaline_autologin_enable"><label id="chevaline_autologin_enable_label" for="chevaline_autologin_enable">Enable Automatic Login</label> \
<br> \
<br> \
<a href="https://github.com/ctag/chevaline_alpha" target="_blank" id="chevaline_button_docs">chevaline? wat do?</a> \
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
