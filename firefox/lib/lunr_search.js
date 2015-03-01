/*
 * Lunr search tools, separated from canvas_api.js to keep code clean but disorganized.
 * Currently does not store index, generates on firefox bootup :|
 */

/*
 * Setup
 */

var sdk = new Object();
sdk.request = require("sdk/request").Request;
sdk.prefs = require('sdk/simple-prefs').prefs;
sdk.ss = require('sdk/simple-storage');

var crapi = require('./canvas_api.js');
var lunr = require('./lunr.min.js'); // for fulltext conversation searching

var searchIndex = lunr(function() {
  this.field('subject', {
    boost: 10
  });
  this.field('last_message_at', {
    boost: 0.01 // We don't really want to search for the date.
  });
  this.field('body');
  this.ref('id');
});

/*
 * Methods
 */

function insertIntoIndex(_data) {
  console.log("\n\ninserting: ", _data);
  var _body = '';
  for (var i2 = 0; i2 < _data.messages.length; i2++) {
    _body += _data.messages[i2].body;
  }
  searchIndex.update({
    id: _data.id,
    subject: _data.subject,
    last_message_at: _data.last_message_at,
    body: _body
  });
}

function addConversationsFromId(_array, _callback) {
  if (typeof(_array) == 'undefined') {
    if (sdk.prefs['debug']) console.log('Tried to insert empty array to search index. Aborting.');
    return;
  }
  for (var i = 0; i < _array.length; i++) {
    crapi.GetOneConversation(_array[i], insertIntoIndex);
  }
  _callback();
}

// Gets the 10 latest conversations and updates the index with them
function updateIndex() {
  crapi.GetConversations(function(_data) {
    for (var _index = 0; _index < _data.length; _index++) {
      addConversationsFromId(_data[_index].id, doBackup);
    }
  });
}

function doBackup() {
  sdk.ss.storage.searchIndex = searchIndex.toJSON();
  if (sdk.prefs['debug']) console.log('Generated search index backup: ', sdk.ss.storage.searchIndex);
}

// Setup the index with all messages
function doInitialize() {
  delete sdk.ss.storage.searchIndex;
  if (typeof(sdk.ss.storage.searchIndex) != 'undefined') {
    // Previous index is available.
    if (sdk.prefs['debug']) console.log('\n\nRestoring search index from backup.', sdk.ss.storage.searchIndex);
    searchIndex = lunr.Index.load(sdk.ss.storage.searchIndex);
    return;
  }
  // No backup available, generate the whole thing again.
  crapi.GetAllConversationIds(addConversationsFromId, doBackup);
}

// Run a query against the searchIndex
function doSearch(_text, _callback) {
  if (sdk.prefs['debug']) console.log("\n\nSearch results: ", searchIndex.search(_text));
  _callback(searchIndex.search(_text));
}

/*
 * Exports
 */

exports.Initialize = doInitialize;
exports.Update = updateIndex;
exports.Search = doSearch;
