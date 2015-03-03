// Adds menu items


var debug = self.options.debug;

var menuDialog = '<div id="chevaline_menu_dialog" title="Chevaline Alpha Menu" style="display: none;">\
<button id="charger_swag_btn">Swag Me</button> \
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

function generateSwagElems(_callback) {
  var num_elems = 12;
  var swag_elems = '';
  var ani_opts = ['moveswagfedora', 'moveswag', 'moveswag2'];
  for (var index = 0; index < num_elems; index++) {
    var rand_ani = Math.floor(Math.random() * ani_opts.length);
    var rand_time = Math.floor(Math.random() * 15)+5; // max time of 20s for scroll
    var left_pos = Math.floor(Math.random() * 98)+1; // percent of screen
    var rand_img = Math.floor(Math.random() * self.options.swagger_imgs.length); // random image
    var elem = '<div class="swag-element" style="-moz-animation: '+ani_opts[rand_ani]+' '+rand_time+'s linear infinite; left: '+left_pos+'%;">';
    elem += '<img class="swag-img" src="'+self.options.swagger_imgs[rand_img]+'"/></div>';
    swag_elems += elem;
  }
  if (typeof(_callback) !== 'undefined') {
    _callback(swag_elems);
  }
}

function addSwagger () {
  generateSwagElems(function (swag_elems) {
    console.log("swag: ", swag_elems);
    // example: <div class="swag-element x1"><img src="http://aokp.co/images/icon-swagger.png" alt="fedora swag!" /></div>
    var swagger = '<div id="pinkglow" style="display: none;"></div>\
    <div id="charger-swagger">'+swag_elems+'</div>';
      var swagger_css = '<link href="' + self.options.swagger_css + '" rel="stylesheet" type="text/css">';
      $('head').append(swagger_css);
      $('body').prepend(swagger);
  });
}

function toggleSwag () {
  $('#charger-swagger').fadeToggle(500).toggleClass('charger-swagger-visible');
  //$('#pinkglow').toggle();
  $('body').toggleClass('charger-pulse');
  $('#main').toggleClass('charger-pulse');
}

$(document).ready(function() {
  addMenu(function () {
    var menu = $('#chevaline_menu');
    var swagBtn = $('#charger_swag_btn');
    swagBtn.button();
    menu.click(function () {
      console.log("click");
      menuDialog.dialog("open");
    });
    swagBtn.click(function () {
      toggleSwag();
    });
  });
  addSwagger();
});
