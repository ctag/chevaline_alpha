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

function insertIntoIndex (_data) {
  console.log("\n\ninserting: ", _data);
  if (!sdk.ss.storage.conversations) {
    // There are no stored conversations
    createSS();
  }
  var _body = '';
  for (var i2 = 0; i2 < _data.messages.length; i2++) {
    _body += _data.messages[i2].body;
  }
  /*sdk.ss.storage.*/searchIndex.update({
    id: _data.id,
    subject: _data.subject,
    last_message_at: _data.last_message_at,
    body: _body
  });
}

function addConversationFromId (_array) {
  if (typeof(_array) == 'undefined') {
    //console.log('Tried to insert empty array to search index. Aborting.');
    return;
  }
  for (var i = 0; i < _array.length; i++) {
    crapi.GetOneConversation(_array[i], insertIntoIndex);
  }
}

// Gets the 10 latest conversations and updates the index with them
function updateIndex() {
  /*
  if (typeof(sdk.ss.storage.searchIndex) == 'undefined') {
    createIndex();
  }
  */
  crapi.GetConversations(function (_data) {
    for (var _index = 0; _index < _data.length; _index++) {
      addConversationFromId(_data[_index].id);
    }
  });
}

// Initialize the searchIndex in simple storage
function createIndex() {
  //console.log('Creating search index.');
  // I'm lazy, just toss the whole thing into simple storage
  sdk.ss.storage.searchIndex = lunr(function() {
    this.field('subject', {
      boost: 10
    })
    this.field('last_message_at', {
      boost: 0.01 // We don't really want to search for the date.
    })
    this.field('body')
    this.ref('id')
  });
}

// Setup the index with all messages
function doInitialize() {
  /*
  if (typeof(sdk.ss.storage.searchIndex) == 'undefined') {
    createIndex();
  }
  */
  crapi.GetAllConversationIds(addConversationFromId);
}

// Run a query against the searchIndex
function doSearch(_text, _callback) {
  console.log("search results: ", /*sdk.ss.storage.*/searchIndex.search(_text));
  console.log(searchIndex.toJSON());
  _callback(/*sdk.ss.storage.*/searchIndex.search(_text));
}

/*
 * Exports
 */

exports.Initialize = doInitialize;
exports.Update = updateIndex;
exports.Search = doSearch;
