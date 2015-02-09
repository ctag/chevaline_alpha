/*
 * Chevaline Alpha
 * A Firefox extension
 * By: Christopher [ctag] Bero
 *
 * I hope you find it utilitous!
 */

/*
 * SDK tools
 */

var tabs = require("sdk/tabs");
var pageMod = require("sdk/page-mod");
var self = require("sdk/self");
var favicons = require("sdk/places/favicon");
var timers = require("sdk/timers");
var urlRequest = require("sdk/request");
var simplePrefs = require('sdk/simple-prefs');
var ss = require('sdk/simple-storage').storage;
var { ToggleButton } = require('sdk/ui/button/toggle');
var panel = require('sdk/panel');

/*
 * Low level or 3rd party tools
 */

var menuitem = require("menuitems");
const {XMLHttpRequest} = require("sdk/net/xhr");

/*
 * Global Vars
 */

var debug = true;
var year = simplePrefs.prefs['year'];
var semester = simplePrefs.prefs['semester'];
var ssoEnabled = simplePrefs.prefs['sso_enabled'];
var mainPanel = panel.Panel({
	contentURL: self.data.url("buttonPanel.html"),
	contentScriptFile: [self.data.url("jquery-2.1.3.min.js"), self.data.url("buttonPanel.js")],
	onHide: panelHidden
});
var mainButton = ToggleButton({
	id: 'chevaline-button',
	label: 'Chevaline Button',
	icon: {
		'16': self.data.url('chevalogo_16.png'),
		'32': self.data.url('chevalogo_32.png'),
		'64': self.data.url('chevalogo_64.png')
	},
	onChange: buttonChanged
});

function update_ssoEnabled ()
{
	ssoEnabled = simplePrefs.prefs['sso_enabled'];
}

simplePrefs.on("sso_enabled", update_ssoEnabled);

/*
 * Items in browser's alt menus
 */

menuitem.Menuitem({
	id: "panel button",
	menuid: "menu_ToolsPopup",
	label: "Show Chevaline Pane",
	onCommand: showPanel(),
	insertbefore: "menu_pageInfo"
});
if (ssoEnabled == true)
{
	menuitem.Menuitem({
		id: "sso_credentials",
		menuid: "menu_ToolsPopup",
		label: "Set UAH SSO Credentials",
		onCommand: showPanel(),
		insertbefore: "menu_pageInfo"
	});
}

/*
 * Drop down pane attached to addon's button
 */

function showPanel () {
	mainPanel.show({
		position: mainButton
	});
}

function panelHidden () {
	mainButton.state('window', {checked: false});
}

/*
 * Toggle button on browser bar
 */

function buttonChanged (state) {
	if (state.checked)
	{
		showPanel();
	}
}

/*
 * Setup
 */

if (!ss.courses)
{
  if (debug) {
	  console.log("Large course object not found, fetching new courses.json");
  }
	getCourses();
} else if (debug) {
	console.log('ss.courses found: ', ss.courses);
}

/*
 * Methods
 */

function getCourses () {
  if (debug) {
	  console.time("getCourses");
    console.log("getCourses(): sending berocs.com request.");
  }
	urlRequest.Request({
	url: "http://berocs.com/chevaline/courses.txt",
	onComplete: function saveCoursesData (result) {
		console.log("berocs.com result: ", result);
		ss.courses=result.json;
		console.log("ss.courses: ", ss.courses);
		makeIndex();
    if (debug) {
		  console.timeEnd("getCourses");
    }
	}
	}).get();
}

function makeIndex () {
  if (debug) {
	  console.time('makeIndex');
	  console.log('makeIndex(): generating index.');
  }

	if (!ss.courses)
	{
    if (debug) {
		  console.log('ss.courses not found, aborting makeIndex().');
    }
		return;
	}

	ss.coursesIndex = {};
	ss.coursesTimeStamp = ss.courses[0][0];
  if (debug) {
	  console.log("ss.courses generated on: ", ss.coursesTimeStamp);
  }

	for (var i = 1; i < ss.courses.length; i++)
	{
		var subcollege = ss.courses[i][0];
		//console.log("subcollege: ", subcollege);
		ss.coursesIndex[subcollege] = {};

		for (var x = 1; x < ss.courses[i].length; x++)
		{
			var course_crn = ss.courses[i][x][1];
			var course_num = ss.courses[i][x][2];
			var course_sec = ss.courses[i][x][3];

			ss.coursesIndex[subcollege][course_crn] = x;
			if (!ss.coursesIndex[subcollege][course_num])
			{
				ss.coursesIndex[subcollege][course_num] = {};
			}
			ss.coursesIndex[subcollege][course_num][course_sec] = x;
		}

	}
  if (debug) {
	  console.log("makeIndex(): index created: ", ss.coursesIndex);
	  console.timeEnd('makeIndex');
  }
}

function traverseIndex () {
  if (debug) {
	  console.time('traverseIndex');
	  console.log('traverseIndex(): printing the index.');
  }

	if (!ss.courses)
	{
    if (debug) {
		  console.log("traverseIndex(): ss.courses missing, aborting function");
    }
		return;
	}

	for (var x = 1; x < ss.courses.length; x++)
	{
		for (var y = 1; y < ss.courses[x].length; y++)
		{
      if (debug) {
			  console.log('course: ', ss.coursesIndex[x][y]);
      }
		}
	}

  if (debug) {
	  console.timeEnd('traverseIndex');
  }
}

mainPanel.port.on('doThing', function () { console.log("did thing."); });

/*
 * Execution
 */

if (debug) {
  tabs.open("http://catalog.uah.edu/content.php?catoid=11&navoid=212");
  tabs.open("about:addons");
}

if (ss.courses && ss.courseIndex)
{
pageMod.PageMod({
	include: "*.uah.edu",
	contentScriptWhen: "end",
	contentScriptFile: [self.data.url("jquery-2.1.3.min.js"), self.data.url("uah_page.js")]
});
}

pageMod.PageMod({
  include: "https://sso.uah.edu/cas/*",
  contentScriptWhen: "end",
  contentScriptFile: [self.data.url("jquery-2.1.3.min.js"), self.data.url("sso_actual.js")],
  onAttach: function (worker) {
    //worker.port.emit("sendCredentials", simplePrefs.prefs['sso_username'], simplePrefs.prefs['sso_password']);
  }
});











