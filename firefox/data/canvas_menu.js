// Adds menu items

var debug = self.options.debug;

var menuDialog = '<div id="chevaline_menu_dialog" title="Chevaline Alpha Menu" style="display: none;">\
<button id="charger_swag_btn">Display Your Charger Pride</button> \
</div>';

function addMenu(_callback) {
  var menu = '<li id="chevaline_menu"> \
  Chevaline \
  </li>';
  $('#identity').prepend(menu);

  $('body').append(menuDialog);

  menuDialog = $('#chevaline_menu_dialog');

  menuDialog.dialog({
    height: 400,
    width: 300,
    autoOpen: false,
    closeOnEscape: true,
    draggable: true,
    hide: 200,
    show: 200,
    modal: false,
    position: {my: "right top-20", at: "right top", of: window}
  });
  if (typeof(_callback) !== 'undefined') {
    _callback();
  }
}

$(document).ready(function() {
  addMenu(function () {
    var menu = $('#chevaline_menu');
    var swagBtn = $('#charger_swag_btn');
    swagBtn.button();

    menu.click(function () {
      menuDialog.dialog("open");
    });

    swagBtn.click(function () {
      self.port.emit('return_chargerPrideClick');
      menuDialog.dialog('close');
    });
  });
});
