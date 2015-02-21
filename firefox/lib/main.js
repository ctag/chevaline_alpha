/*
* Chevaline Alpha
* A Firefox extension
* By: Christopher [ctag] Bero
*
* I hope you find it utilitous!
*/

/* TODO
 * Fix Atom's comment formatting
 * Interact with SSO page
 */

/*
* SDK tools
*/

var sdk = new Object();
sdk.tabs = require("sdk/tabs");
sdk.pageMod = require("sdk/page-mod");
sdk.selfMod = require("sdk/self");
sdk.favicons = require("sdk/places/favicon");
sdk.timers = require("sdk/timers");
sdk.urlRequest = require("sdk/request");
sdk.simplePrefs = require('sdk/simple-prefs');
sdk.ss = require('sdk/simple-storage').storage;
sdk.panel = require('sdk/panel');
sdk.passwords = require('sdk/passwords');

/*
* Low level or 3rd party tools
*/

var menuitem = require("menuitems");
var sso = require("./sso.js");
const {XMLHttpRequest} = require("sdk/net/xhr");

/*
* Global Vars
*/

var debug = false;
var year = sdk.simplePrefs.prefs['year'];
var semester = sdk.simplePrefs.prefs['semester'];
var ssoEnabled = sdk.simplePrefs.prefs['sso_enabled'];
var canvasEnabled = sdk.simplePrefs.prefs['canvas_enabled'];
//var ssoUser = sdk.simplePrefs.prefs['sso_user'];
var ssoPageMod;

function handle_simplePrefs (_pref)
{
	if (_pref === "sso_enabled")
	{
		ssoEnabled = sdk.simplePrefs.prefs['sso_enabled'];
		if (ssoEnabled) {
			setupSSOpagemod();
		} else {
			ssoPageMod.destroy();
		}
	} else if (_pref === "sso_user") {
		sso_setCredentials(sdk.simplePrefs.prefs['sso_user']);
	} else if (_pref === 'canvas_enabled') {
		canvasEnabled = sdk.simplePrefs.prefs['canvas_enabled'];
		if (canvasEnabled) {
			//
		} else {
			//
		}
	}
}

sdk.simplePrefs.on("sso_enabled", handle_simplePrefs);
sdk.simplePrefs.on("sso_user", handle_simplePrefs);

/*
* Items in browser's alt menus
*/

menuitem.Menuitem({
	id: "sdk.panel button",
	menuid: "menu_ToolsPopup",
	label: "Show Chevaline Pane",
	//onCommand: showPanel(),
	insertbefore: "menu_pageInfo"
});

/*
* Setup
*/

if (!sdk.ss.courses)
{
	if (debug) { console.log("Large course object not found, fetching new courses.json"); }
	getCourses();
} else if (debug) {
	console.log('sdk.ss.courses found: ', sdk.ss.courses);
}

/*
* Methods
*/

function getCourses () {
	if (debug) {
		console.time("getCourses");
		console.log("getCourses(): sending berocs.com request.");
	}
	sdk.urlRequest.Request({
		url: "http://berocs.com/chevaline/courses.txt",
		onComplete: function saveCoursesData (result) {
			console.log("berocs.com result: ", result);
			sdk.ss.courses=result.json;
			if (debug) console.log("sdk.ss.courses: ", sdk.ss.courses);
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

	if (!sdk.ss.courses)
	{
		if (debug) console.log('sdk.ss.courses not found, aborting makeIndex().');
		return;
	}

	sdk.ss.coursesIndex = {};
	sdk.ss.coursesTimeStamp = sdk.ss.courses[0][0];
	if (debug) {
		console.log("sdk.ss.courses generated on: ", sdk.ss.coursesTimeStamp);
	}

	for (var i = 1; i < sdk.ss.courses.length; i++)
	{
		var subcollege = sdk.ss.courses[i][0];
		//console.log("subcollege: ", subcollege);
		sdk.ss.coursesIndex[subcollege] = {};

		for (var x = 1; x < sdk.ss.courses[i].length; x++)
		{
			var course_crn = sdk.ss.courses[i][x][1];
			var course_num = sdk.ss.courses[i][x][2];
			var course_sec = sdk.ss.courses[i][x][3];

			sdk.ss.coursesIndex[subcollege][course_crn] = x;
			if (!sdk.ss.coursesIndex[subcollege][course_num])
			{
				sdk.ss.coursesIndex[subcollege][course_num] = {};
			}
			sdk.ss.coursesIndex[subcollege][course_num][course_sec] = x;
		}

	}
	if (debug) {
		console.log("makeIndex(): index created: ", sdk.ss.coursesIndex);
		console.timeEnd('makeIndex');
	}
}

function traverseIndex () {
	if (debug) {
		console.time('traverseIndex');
		console.log('traverseIndex(): printing the index.');
	}

	if (!sdk.ss.courses)
	{
		if (debug) {
			console.log("traverseIndex(): sdk.ss.courses missing, aborting function");
		}
		return;
	}

	for (var x = 1; x < sdk.ss.courses.length; x++)
	{
		for (var y = 1; y < sdk.ss.courses[x].length; y++)
		{
			if (debug) {
				console.log('course: ', sdk.ss.coursesIndex[x][y]);
			}
		}
	}

	if (debug) {
		console.timeEnd('traverseIndex');
	}
}
/*
* Execution
*/

if (debug) {
	sdk.tabs.open("http://canvas.uah.edu");
	//tabs.open("http://catalog.uah.edu/content.php?catoid=11&navoid=212");
	sdk.tabs.open("about:addons");
}

if (sdk.ss.courses && sdk.ss.courseIndex)
{
	sdk.pageMod.PageMod({
		include: "*.uah.edu",
		contentScriptWhen: "end",
		contentScriptFile: [sdk.selfMod.data.url("jquery-2.1.3.min.js"), sdk.selfMod.data.url("uah_page.js")]
	});
}

setupSSOpagemod();

if (canvasEnabled)
{
	//
}

function setupCanvaspagemode ()
{
	function _onAttach (worker) {
		//
	}
	canvasPageMod = sdk.pageMod.PageMod({
		include: 'https://uah.instructure.com/*',
		contentScriptWhen: 'end',
		contentScriptFile: [sdk.selfMod.data.url("jquery-2.1.3.min.js"), sdk.selfMod.data.url("canvas_mod.js")],
		onAttach: _onAttach
	});
}

function setupSSOpagemod ()
{
	function _onAttach (worker) {
		if (debug) console.log("searching credentials for ", sso.GetUsername());
		function _sendCredentials (_cred) {
			if (debug) console.log("sending: ", _cred);
			worker.port.emit('sendCredentials', _cred);
		}
		sso.GetCredentials(_sendCredentials);
		/*sdk.passwords.search({
			realm: "chevaline_sso",
			username: sso.GetUsername,
			onComplete: function _onComplete (credentials) {
				console.log("evaluating credentials to send: ", credentials);
				if (typeof credentials[0] != "undefined") {
					worker.port.emit("sendCredentials", credentials);
				}
			}
		});*/
		worker.port.on('ssoEnabled', function (_enabled) {
			if (_enabled == true) {
				sdk.simplePrefs.prefs.sso_enabled = true;
			} else {
				sdk.simplePrefs.prefs.sso_enabled = false;
			}
		});
		worker.port.on('ssoPassword', function (_password) {
			if (debug) {console.log("setting password: ", _password)}
			sso.SetPassword(_password);
		});
	}
	ssoPageMod = sdk.pageMod.PageMod({
		include: "https://sso.uah.edu/cas/*",
		contentScriptWhen: "end",
		contentScriptFile: [sdk.selfMod.data.url("jquery-2.1.3.min.js"), sdk.selfMod.data.url('jquery-ui/jquery-ui.min.js'), sdk.selfMod.data.url("sso_mod.js")],
		//contentStyleFile: [sdk.selfMod.data.url('jquery-ui/jquery-ui.min.css')], /* Doesn't work, because EVERYTHING can override it */
		contentScriptOptions: {
			'background_url' : sdk.selfMod.data.url('dialog_background_alternate.png'),
			'jquery_ui_css': sdk.selfMod.data.url('jquery-ui/jquery-ui.min.css'),
			'jquery_ui_theme_css': sdk.selfMod.data.url('jquery-ui/jquery-ui.theme.min.css'),
			'sso_enabled': ssoEnabled
			},
		onAttach: _onAttach
	});
}
