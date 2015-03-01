
console.log('running canvas_inbox_mod.js');

var conversations; // Holds jquery elements for search results. Hacky.

var search = '<style> \
.chevaline_search_result { \
background-color: #FFFF00; \
} \
</style> \
<div id="chevaline_message_search" class="search form-search course-filter" role="search"> \
<div class="ac"> \
<div class="ac-input-box"> \
Something? \
</div> \
</div> \
</div>';

$(document).ready( function () {
  var test = $('#search-btn').clone().attr('id', 'chevaline_search_btn')
    .prop('title', 'Search FullText').removeClass('ac-search-btn recipient-finder')
    .css({
      'border-radius': '3px',
      'border': '1px solid #D1D1D1',
      'margin-left': '5px'
    });
  test.find('i').removeClass('icon-address-book').addClass('ui-icon ui-icon-search');
  var width = $('#search-autocomplete').width();
  $('#ac-result-list-2').css({
    'position': 'relative',
    'left': '-55px'
  })
  $('#search-autocomplete').css('width', (width+55)+"px").append(test);

  self.port.on('send_searchResults', function (_results) {
    if (sdk.prefs['debug']) console.log("received results: ", _results);
    conversations.has("h3.subject:contains('" + _results + "')").addClass('chevaline_search_result').css('display', 'list-item');
  })

  self.port.on('send_searchBegin', function () {
    conversations = $('ul.messages li');
    conversations.removeClass('chevaline_search_result');
    conversations.css('display', 'none');
  });

  test.click(function () {
    var search = $('input#compose-message-recipients').val();
    self.port.emit('request_search', search);
  });
});
