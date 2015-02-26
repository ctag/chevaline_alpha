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

var sdk = new Object();
sdk.tabs = require("sdk/tabs");
sdk.pageMod = require("sdk/page-mod");
sdk.selfMod = require("sdk/self");
sdk.favicons = require("sdk/places/favicon");
sdk.timers = require("sdk/timers");
sdk.urlRequest = require("sdk/request");
sdk.simplePrefs = require('sdk/simple-prefs');
sdk.prefs = require('sdk/simple-prefs').prefs;
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

var year = sdk.prefs['year'];
var semester = sdk.prefs['semester'];

/*
* Items in browser's alt menus
*/
/*
menuitem.Menuitem({
	id: "chevaline_button_test",
	menuid: "menu_ToolsPopup",
	label: "Chevaline Alpha",
	disabled: true,
	//onCommand: showPanel(),
	insertbefore: "menu_pageInfo",
	image: sdk.selfMod.data.url('chevalogo_16.png')
});
*/

/*
* Methods
*/

function getCourses () {
	if (sdk.prefs['debug']) {
		console.time("getCourses");
		console.log("getCourses(): sending berocs.com request.");
	}
	sdk.urlRequest.Request({
		url: "http://berocs.com/chevaline/courses.txt",
		onComplete: function saveCoursesData (result) {
			console.log("berocs.com result: ", result);
			sdk.ss.courses=result.json;
			if (sdk.prefs['debug']) console.log("sdk.ss.courses: ", sdk.ss.courses);
			makeIndex();
			if (sdk.prefs['debug']) {
				console.timeEnd("getCourses");
			}
		}
	}).get();
}

function makeIndex () {
	if (sdk.prefs['debug']) {
		console.time('makeIndex');
		console.log('makeIndex(): generating index.');
	}

	if (!sdk.ss.courses)
	{
		if (sdk.prefs['debug']) console.log('sdk.ss.courses not found, aborting makeIndex().');
		return;
	}

	sdk.ss.coursesIndex = {};
	sdk.ss.coursesTimeStamp = sdk.ss.courses[0][0];
	if (sdk.prefs['debug']) {
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
	if (sdk.prefs['debug']) {
		console.log("makeIndex(): index created: ", sdk.ss.coursesIndex);
		console.timeEnd('makeIndex');
	}
}

function traverseIndex () {
	if (sdk.prefs['debug']) {
		console.time('traverseIndex');
		console.log('traverseIndex(): printing the index.');
	}

	if (!sdk.ss.courses)
	{
		if (sdk.prefs['debug']) {
			console.log("traverseIndex(): sdk.ss.courses missing, aborting function");
		}
		return;
	}

	for (var x = 1; x < sdk.ss.courses.length; x++)
	{
		for (var y = 1; y < sdk.ss.courses[x].length; y++)
		{
			if (sdk.prefs['debug']) {
				console.log('course: ', sdk.ss.coursesIndex[x][y]);
			}
		}
	}

	if (sdk.prefs['debug']) {
		console.timeEnd('traverseIndex');
	}
}

function setupCanvaspagemod ()
{
	function _onAttach (worker) {
		console.log("attaching to canvas");
		// This works, POST does not.
		sdk.urlRequest.Request({
			url: 'https://canvas.instructure.com/api/v1/courses?access_token=<token>',
			/*headers: {
				"Authorization": 'BEARER <token>'
				/*"Access-Control-Allow-Origin": "*"*
			},*/
			onComplete: function (resp) {
				console.log("here 1 : ", resp, resp.json, /*resp.text,*/ resp.status, resp.statusText, resp.headers);
			}
		}).get();
	}
	canvasPageMod = sdk.pageMod.PageMod({
		include: 'https://uah.instructure.com/*',
		//exclude: /.*conversations.*/,
		contentScriptWhen: 'end',
		contentScriptFile: [sdk.selfMod.data.url("jquery-2.1.3.min.js"), sdk.selfMod.data.url('jquery-ui/jquery-ui.min.js'), sdk.selfMod.data.url("canvas_mod.js")],
		contentScriptOptions: {
			'background_url' : sdk.selfMod.data.url('dialog_background_alternate.png'),
			'jquery_ui_css': sdk.selfMod.data.url('jquery-ui/jquery-ui.min.css'),
			'jquery_ui_theme_css': sdk.selfMod.data.url('jquery-ui/jquery-ui.theme.min.css')
		},
		onAttach: _onAttach
	});

	sdk.pageMod.PageMod({
		include: /.*uah\.instructure.*conversations.*/,
		contentScriptWhen: 'start',
		contentScriptFile: [sdk.selfMod.data.url("jquery-2.1.3.min.js"), sdk.selfMod.data.url('jquery-ui/jquery-ui.min.js'), sdk.selfMod.data.url("canvas_mod.js"), sdk.selfMod.data.url('jso.js'), sdk.selfMod.data.url("canvas_inbox_mod.js")],
		contentScriptOptions: {
			'background_url' : sdk.selfMod.data.url('dialog_background_alternate.png'),
			'jquery_ui_css': sdk.selfMod.data.url('jquery-ui/jquery-ui.min.css'),
			'jquery_ui_theme_css': sdk.selfMod.data.url('jquery-ui/jquery-ui.theme.min.css')
		},
		onAttach: _onAttach
	});
}

function setupSSOpagemod ()
{
	function _onAttach (worker) {
		worker.port.on('request_ssoEnabled', function () {
			worker.port.emit('send_ssoEnabled', sdk.prefs['sso_enabled']);
		});

		worker.port.on('return_ssoEnabled', function (_enabled) {
			if (sdk.prefs['debug']) console.log("main.js: updating sso_enabled simplePref, ", _enabled);
			sdk.prefs.sso_enabled = _enabled;
			if (sdk.prefs['debug']) console.log("main.js: new simplePrefs sso_enabled, ", sdk.prefs.sso_enabled);
		});

		worker.port.on('request_ssoCredential', function () {
			function _sendCredential (_cred) {
				if (sdk.prefs['debug']) console.log("credentials: ", _cred);
				worker.port.emit('send_ssoCredential', _cred[0]);
			}
			sso.GetCredentials(_sendCredential);
		});
	}
	ssoPageMod = sdk.pageMod.PageMod({
		include: ["https://sso.uah.edu/cas/*", 'https://dev.uah.edu/cas/login'],
		contentScriptWhen: "ready",
		contentScriptFile: [sdk.selfMod.data.url("jquery-2.1.3.min.js"), sdk.selfMod.data.url('jquery-ui/jquery-ui.min.js'), sdk.selfMod.data.url("sso_mod.js")],
		//contentStyleFile: [sdk.selfMod.data.url('jquery-ui/jquery-ui.min.css')], /* Doesn't work, because EVERYTHING overrides it */
		contentScriptOptions: {
			'background_url' : sdk.selfMod.data.url('dialog_background_alternate.png'),
			'jquery_ui_css': sdk.selfMod.data.url('jquery-ui/jquery-ui.min.css'),
			'jquery_ui_theme_css': sdk.selfMod.data.url('jquery-ui/jquery-ui.theme.min.css'),
			'sso_enabled': sdk.prefs['sso_enabled'],
			'sso_timeout': 1000,
			'debug': sdk.prefs['debug']
			},
		onAttach: _onAttach
	});
}

/*
* Execution
*/

if (!sdk.ss.courses)
{
	if (sdk.prefs['debug']) { console.log("Large course object not found, fetching new courses.json"); }
	//getCourses();
} else if (sdk.prefs['debug']) {
	console.log('sdk.ss.courses found: ', sdk.ss.courses);
}

if (sdk.prefs['debug']) {
	sdk.tabs.open("about:addons");
	sdk.tabs.open("http://canvas.uah.edu");
	//sdk.tabs.open("http://catalog.uah.edu/content.php?catoid=11&navoid=212");
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
setupCanvaspagemod();
