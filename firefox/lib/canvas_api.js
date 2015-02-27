// The Canvas Rest API - CRAPI

/*
 * Setup
 */

var sdk = new Object();
sdk.request = require("sdk/request").Request;
sdk.prefs = require('sdk/simple-prefs').prefs;

var crapi = new Object(); // canvas-api
crapi.lunr = require('./lunr.min.js'); // for fulltext conversation searching
crapi.rootURL = 'https://uah.instructure.com';
crapi.searchIndex = crapi.lunr(function () {
  this.field('subject', {boost: 10})
  this.field('body')
  this.ref('id')
});

function api_handleError (_url, _response) {
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
  _url = crapi.rootURL + _api + '?access_token=' + sdk.prefs['api_token'];
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

function api_getAllConversations(_callback) {
  _apiURL = '/api/v1/conversations';
  api_getJSON(_apiURL, _callback, null);
}

function api_getAllConversationIds(_callback) {
  _apiURL = '/api/v1/conversations';
  _content = {
    "include_all_conversation_ids": "true"
  }
  function _return (_result) {
    _callback(_result.conversation_ids);
  }
  api_getJSON(_apiURL, _return, _content);
}

function api_getOneConversation(_id, _callback) {
  _apiURL = '/api/v1/conversations/' + _id;
  api_getJSON(_apiURL, _callback, null);
}

function api_indexConversations() {
  function _addConversationFromId (_array) {
    function _insertIntoIndex (_data) {
      console.log("inserting: ", _data.id, _data.subject);
      var _body = '';
      for (var i2 = 0; i2 < _data.messages.length; i2++) {
        _body += _data.messages[i2].body;
      }
      crapi.searchIndex.add({
        id: _data.id,
        subject: _data.subject,
        body: _body
      });
    }
    for (var i = 0; i < _array.length; i++) {
      api_getOneConversation(_array[i], _insertIntoIndex);
    }
  }
  api_getAllConversationIds(_addConversationFromId);
}

function api_searchConversations(_text, _callback) {
  console.log("search results: ", crapi.searchIndex.search(_text));
  _callback(crapi.searchIndex.search(_text));
}

exports.IndexConversations = api_indexConversations;
exports.SearchConversations = api_searchConversations;
exports.GetAllConversations = api_getAllConversations;
exports.GetAllConversationIds = api_getAllConversationIds;
exports.GetOneConversation = api_getOneConversation;
