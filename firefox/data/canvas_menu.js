// Adds menu items


var debug = self.options.debug;

var menuDialog = '<div id="chevaline_menu_dialog" title="Chevaline Alpha Menu" style="display: none;">\
Main Content \
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

function addSwagger () {
  var swagger = '<div id="pinkglow" style="display: none;"></div>\
  <div id="charger-swagger"> \
        <div class="swag-element x1"><img src="http://aokp.co/images/icon-swagger.png" alt="fedora swag!" /></div>\
        <div class="swag-element x2"><img src="http://aokp.co/images/icon-swagger.png" alt="fedora swag!" /></div>\
        <div class="swag-element x3"><img src="http://aokp.co/images/icon-swagger.png" alt="fedora swag!" /></div>\
        <div class="swag-element x4"><img src="http://aokp.co/images/icon-swagger.png" alt="fedora swag!" /></div>\
        <div class="swag-element x5"><img src="http://aokp.co/images/icon-swagger.png" alt="fedora swag!" /></div>\
        <div class="swag-element x6"><img src="http://aokp.co/images/aokp-logo-large.png" alt="unicorn swag!" /></div>\
        <div class="swag-element x7"><img src="http://aokp.co/images/aokp-logo-large.png" alt="unicorn swag!" /></div>\
        <div class="swag-element x8"><img src="http://aokp.co/images/aokp-logo-large.png" alt="unicorn swag!" /></div>\
        <div class="swag-element x9"><img src="http://aokp.co/images/aokp-logo-large.png" alt="unicorn swag!" /></div>\
        <div class="swag-element x10"><img src="http://aokp.co/images/aokp-logo-large.png" alt="unicorn swag!" /></div>\
    </div>';
    var swagger_css = '<link href="' + self.options.swagger_css + '" rel="stylesheet" type="text/css">';
    $('head').append(swagger_css);
    $('body').prepend(swagger);
}


$(document).ready(function() {
  addMenu(function () {
    var menu = $('#chevaline_menu');
    menu.click(function () {
      console.log("click");
      $('#charger-swagger').fadeToggle(500);
      //$('#pinkglow').toggle();
      $('body').toggleClass('charger-pulse');
      $('#main').toggleClass('charger-pulse');
      //menuDialog.dialog("open");
    });
  });
  addSwagger();
});
