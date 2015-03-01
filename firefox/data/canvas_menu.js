// Adds menu items


var debug = self.options.debug;

function addMenu() {
  var menu = '<li id="chevaline_menu"> \
  Chevaline \
  </li>';
  $('#identity').append(menu);
}


$(document).ready(function() {
  addMenu();
});
