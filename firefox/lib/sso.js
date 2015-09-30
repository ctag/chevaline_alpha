/* SSO.JS - Single Sign On Script
*/

var sdk = {};
sdk.passwords = require('sdk/passwords');
sdk.prefs = require('sdk/simple-prefs').prefs;

function sso_setCredentials(_username, _password, _callback)
{
  function _error (_err) {
    sso_handleError('sso_setCredentials', _err);
  }

  function _onComplete () {
    if (sdk.prefs.debug) console.log("new sso credentials: ", _cred);
    sdk.passwords.store({
      url: sdk.prefs.sso_url,
      username: _username,
      password: _password
    });
    _callback;
  }

  sdk.passwords.search({
    url: sdk.prefs.sso_url,
    onComplete: sso_clearCredentials(_onComplete),
    onError: _error
  });
}

function sso_clearCredentials(_callback)
{
  function _error (_err) {
    sso_handleError('sso_clearCredentials', _err);
  }

  function _onComplete (_cred) {
    _cred.forEach(sdk.passwords.remove);
    if (sdk.prefs.debug) console.log("sso credentials: ", _cred);
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
    if (_cred[0]) {
      if (sdk.prefs.debug) console.log("sso credentials: ", _cred);
      _callback(_cred);
    } else {
      if (sdk.prefs.debug) console.log("sso_getCredentials: credentials appear to be missing");
    }
  }

  sdk.passwords.search({
    url: sdk.prefs.sso_url,
    onComplete: _onComplete,
    onError: _error
  });
}

function sso_handleError (_source, _err)
{
  if (sdk.prefs.debug) console.log('Chevaline_Alpha; ', _source, _err.message);
}

exports.GetCredentials = sso_getCredentials;
exports.SetCredentials = sso_setCredentials;
exports.Clear = sso_clearCredentials;
