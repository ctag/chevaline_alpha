/* SSO.JS - Single Sign On Script
 */

 var passwords = require('sdk/passwords');
 var simplePrefs = require('sdk/simple-prefs');

 var debug = simplePrefs.prefs['debug'];

 function sso_setCredentials(_password, _user, _callback)
 {
   if (debug) console.log("sso_setCredentials: ", _user, _password);
     sso_clearCredentials(function (_cred) {
       passwords.store({
       realm: "chevaline_sso",
       username: _user,
       password: _password,
       onError: function (_err) {
         sso_handleError('sso_setCredentials', _err);
       }
     });
   });
 }

 function sso_clearCredentials(_callback)
 {
   passwords.search({
     realm: "chevaline_sso",
     onComplete: function (_cred) {
       _cred.forEach(passwords.remove);
       if (debug) console.log("sso credentials: ", _cred);
       _callback(_cred);
     },
     onError: function (_err) {
       sso_handleError('sso_clearCredentials', _err);
     }
   });
 }

 function sso_getCredentials()
 {
   passwords.search({
     realm: "chevaline_sso",
     username: ssoUser,
     onComplete: function (_cred) {
         if (debug) console.log("sso credentials: ", _cred);
     },
     onError: function (_err) {
       sso_handleError('sso_getCredentials', _err);
     }
   });
 }

function sso_handleError (_source, _err)
{
  if (debug) console.log('Chevaline_Alpha; SSO Error: ', _source, _err.message);
}

exports.Set = sso_setCredentials;
exports.Get = sso_setCredentials;
exports.Clear = sso_setCredentials;
