//
// Canvas_mod
//

/*
 * Setup
 */

var debug = self.options.debug;
var cleanupPage = self.options.cleanup_page;
var extendSession = self.options.extend_session;
var mod = new Object();

/*
 * Functions
 */

function do_cleanupPage () {
  // Don't store elements in variables, because we should only need to latch once.
  // Get rid of "use our app" advertisements.
  $("meta:contains('apple-itunes-app')").remove();
  $("meta:contains('google-play-app')").remove();
  // Get rid of the javascript banner.
  $("noscript:contains('You need to have JavaScript')").remove();
}

function do_injectCSS () {
  mod.theme_css = '<link href="' + self.options.jquery_ui_theme_css + '" rel="stylesheet" type="text/css">';
  //$('head').append(mod.theme_css);

  mod.ui_css = '<link href="' + self.options.jquery_ui_css + '" rel="stylesheet" type="text/css">';
  //$('head').append(mod.ui_css);
}

// From what we know:
// There is a 10 hour hard cap for session life
// There is a 2 hour inactivity cap which is not extended with ajax requests
// There is a bug which provokes varied <2hr logout events

/*
 * Execution
 */
$(document).ready(function () {
  if (cleanupPage) {
    do_cleanupPage();
  }
  do_injectCSS();
}); // end document.ready()
