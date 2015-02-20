/* SSO.JS - Single Sign On Script
*/

var sdk = new Object();
sdk.passwords = require('sdk/passwords');
sdk.simplePrefs = require('sdk/simple-prefs');

var ssoUser = sdk.simplePrefs.prefs['sso_user'];

var debug = sdk.simplePrefs.prefs['debug'];

function sso_setUsername(_user, _callback)
{
  if (debug) console.log("sso_setUsername: ", _user);
  ssoUser = _user;
}

function sso_getUsername()
{
  return ssoUser;
}

function sso_setPassword(_password, _callback)
{
  if (debug) console.log("sso_setPassword: ", _password);
  function _error (_err) {
    sso_handleError('sso_setPassword', _err);
  }

  function _addCred () {
    sdk.passwords.store({
      realm: "chevaline_sso",
      username: ssoUser,
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

  sdk.passwords.search({
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

  sdk.passwords.search({
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
exports.GetCredentials = sso_getCredentials;
exports.GetUsername = sso_getUsername;
exports.Clear = sso_clearCredentials;
