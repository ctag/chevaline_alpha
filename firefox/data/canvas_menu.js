// Adds menu items

var debug = self.options.debug;

var menuDialog = '<div id="chevaline_menu_dialog" title="Chevaline Alpha Menu">\
<button id="charger_swag_btn">Display Your Charger Pride</button> \
<br> \
<button id="charger_lunr_rebuild_btn">Rebuild LUNR Search Index</button> \
</div>';

function addMenu(_callback) {
  var menu = '<li id="chevaline_menu"><a href="#"> \
  Chevaline \
  </a></li>';
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
    dialogClass: "chevaline-ui",
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
    var lunrRebuildBtn = $('#charger_lunr_rebuild_btn');
    lunrRebuildBtn.button();

    menu.click(function () {
      menuDialog.dialog("open").css('z-index', 200);
      $('.chevaline-ui').css('z-index', 200); // You know what's absolutely disgusting? This.
    });

    swagBtn.click(function () {
      self.port.emit('return_chargerPrideClick');
      menuDialog.dialog('close');
    });
    lunrRebuildBtn.click(function () {
      self.port.emit('return_lunrRebuild');
      menuDialog.dialog('close');
    });

  });
});
