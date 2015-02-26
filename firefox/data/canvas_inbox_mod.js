
console.log('running canvas_inbox_mod.js');

var search = '<div id="chevaline_message_search" class="search form-search course-filter" role="search"> \
<div class="ac"> \
<div class="ac-input-box"> \
Something? \
</div> \
</div> \
</div>';

/*
var jso = new JSO({
  providerID: "Canvas",
  client_id: "3930~AypxQk89BAySb012revtBR5MW6lknVp8pJl588XiFP6fxXalA3fbJ0WQaehwZnsQ",
  authorization: "https://canvas.instructure.com/api/v1/courses"
});

jso.callback();

JSO.enablejQuery($);

jso.ajax({
  url: "https://www.canvas.instructure.com/api/v1/courses",
  dataType: 'json',
  success: function(data){
    console.log("success, ", data);
  }
});
*/

$(document).ready( function () {
  var test = $('#search-btn').clone().attr('id', 'chevaline_search_btn').removeClass('ac-search-btn recipient-finder');
  var width = $('#search-autocomplete').width();
  $('#search-autocomplete').css('width', (width+50)+"px").append(test);

  test.click(function () {
    var search = $('input#compose-message-recipients').text();
    var messages = $('ul.messages').children().each(function () {
      $(this).click();
      var match = $('div.message-detail:contains("' +search+ '")')[0];
      if (!match) {
        $(this).hide();
      }
    });
  });
});
