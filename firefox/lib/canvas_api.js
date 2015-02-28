// The Canvas Rest API - CRAPI

/*
 * Setup
 */

var sdk = new Object();
sdk.request = require("sdk/request").Request;
sdk.prefs = require('sdk/simple-prefs').prefs;
//sdk.ss = require('sdk/simple-storage');

var crapi = new Object(); // canvas-api
crapi.rootURL = 'https://uah.instructure.com';

function api_handleError (_url, _response) {
  if (typeof(_response) === 'undefined') {
    return true;
  }
  if (typeof(_response.errors) === 'undefined') {
    return false;
  }
  var _len = _response.errors.length;
  for (var i = 0; i < _len; i++) {
    console.log("CRAPI Error: ", _url, ", ", _response.errors[i].message);
  }
  return true;
}

function api_getJSON (_api, _callback, _opts) {
  // This works, POST does not.
  _url = crapi.rootURL + _api + '?access_token=' + sdk.prefs['canvas_api_token'];
  sdk.request({
    url: _url,
    content: _opts,
    onComplete: function (_resp) {
      if (api_handleError(_url, _resp.json)) {
        return;
      }
      //console.log("api result : ", _resp, _resp.json, /*_resp.text,*/ _resp.status, _resp.statusText/*, _resp.headers*/);
      _callback(_resp.json);
    }
  }).get();
}

function api_getConversations(_callback) {
  _apiURL = '/api/v1/conversations';
  api_getJSON(_apiURL, _callback, null);
}

function api_getAllConversationIds(_callback) {
  _apiURL = '/api/v1/conversations';
  _content = {
    "include_all_conversation_ids": "true"
  }
  function _return (_result) {
    //console.log("results: ", _result);
    _callback(_result.conversation_ids);
  }
  api_getJSON(_apiURL, _return, _content);
}

function api_getOneConversation(_id, _callback) {
  _apiURL = '/api/v1/conversations/' + _id;
  api_getJSON(_apiURL, _callback, null);
}

/*
 * Exports
 */

exports.GetConversations = api_getConversations;
exports.GetAllConversationIds = api_getAllConversationIds;
exports.GetOneConversation = api_getOneConversation;
