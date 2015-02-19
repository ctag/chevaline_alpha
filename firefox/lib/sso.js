/* SSO.JS - Single Sign On Script
*/

var passwords = require('sdk/passwords');
var simplePrefs = require('sdk/simple-prefs');

var ssoUser = '';

var debug = simplePrefs.prefs['debug'];

function sso_setUsername(_user, _callback)
{
  if (debug) console.log("sso_setUsername: ", _user);
  ssoUser = _user;
}

function sso_setPassword(_password, _callback)
{
  if (debug) console.log("sso_setPassword: ", _password);
  function _error (_err) {
    sso_handleError('sso_setPassword', _err);
  }

  function _addCred () {
    passwords.store({
      realm: "chevaline_sso",
      username: _user,
      password: _password,
      onError: _error
    });
  }

  sso_clearCredentials(_addCred);
}

function sso_clearCredentials(_callback)
{
  function _error (_err) {
    sso_handleError('sso_clearCredentials', _err);
  }

  function _onComplete (_cred) {
    _cred.forEach(passwords.remove);
    if (debug) console.log("sso credentials: ", _cred);
    _callback(_cred);
  }

  passwords.search({
    realm: "chevaline_sso",
    onComplete: _onComplete,
    onError: _error
  });
}

function sso_getCredentials(_callback)
{
  function _error (_err) {
    sso_handleError('sso_getCredentials', _err);
  }

  function _onComplete (_cred) {
    if (debug) console.log("sso credentials: ", _cred);
    _callback(_cred);
  }

  passwords.search({
    realm: "chevaline_sso",
    username: ssoUser,
    onComplete: _onComplete,
    onError: _error
  });
}

function sso_handleError (_source, _err)
{
  if (debug) console.log('Chevaline_Alpha; ', _source, _err.message);
}

exports.SetUsername = sso_setUsername;
exports.SetPassword = sso_setPassword;
exports.Get = sso_getCredentials;
exports.Clear = sso_clearCredentials;
