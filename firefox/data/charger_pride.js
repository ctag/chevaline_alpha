// Elements to display floating items

function generateSwagElems(_callback) {
  var swag_elems = ''; // Leave blank, is filled later.
  for (var index = 0; index < self.options.swagger_count; index++) {
    var rand_ani = Math.floor(Math.random() * 2)+1; // Number of animation css rules (minus 1). Format: moveswag##
    var rand_time = Math.floor(Math.random() * 25)+10; // max time of 20s for scroll
    var left_pos = Math.floor(Math.random() * 98)+1; // percent of screen
    var rand_img = Math.floor(Math.random() * (self.options.swagger_imgs.length-1)); // random image
    var elem = '<div class="swag-element" style="-moz-animation: moveswag'+rand_ani+' '+rand_time+'s linear infinite; left: '+left_pos+'%;">';
    elem += '<img class="swag-img" src="'+self.options.swagger_imgs[rand_img]+'"/></div>';
    swag_elems += elem;
  }
  if (typeof(_callback) !== 'undefined') {
    _callback(swag_elems);
  }
}

function addSwagger () {
  generateSwagElems(function (swag_elems) {
    //console.log("swag: ", swag_elems);
    // example: <div class="swag-element x1"><img src="http://aokp.co/images/icon-swagger.png" alt="fedora swag!" /></div>
    var swagger = '<div id="pinkglow" style="display: none;"></div>\
    <div id="charger-swagger" class="charger-swagger-visible">'+swag_elems+'</div>';
      var swagger_css = '<link href="' + self.options.swagger_css + '" rel="stylesheet" type="text/css">';
      $('head').append(swagger_css);
      $('body').prepend(swagger);
  });
}

function toggleSwag () {
  if ($('#charger-swagger').length) {
    $('#charger-swagger').fadeToggle(700).toggleClass('charger-swagger-visible');
  } else {
    addSwagger();
  }
  //$('#pinkglow').toggle();
  $('body').toggleClass('charger-pulse');
  $('#main').toggleClass('charger-pulse');
  $('ul.messages > li').toggleClass('charger-pulse');
}

/*
 * Execution
 */

self.port.on('send_chargerPrideClick', function () {
  toggleSwag();
});
