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
var ss = require('sdk/simple-storage');

/*
 * Low level or 3rd party tools
 */
var menuitem = require("menuitems");
const {XMLHttpRequest} = require("sdk/net/xhr");

/*
 * Global Vars
 */
var year = simplePrefs.prefs['year'];
var semester = simplePrefs.prefs['semester'];

/*
 * Methods
 */

function getCourses () {
	console.log("getCourses(): sending berocs.com request.");
	urlRequest.Request({
	url: "http://berocs.com/chevaline/courses.json",
	onComplete: function saveCoursesData (result) {
		console.log("berocs.com result: ", result);
		ss.courses=result.json;
		console.log("ss.courses: ", ss.courses);
		makeIndex();
	}
	}).get();
	
}

function makeIndex () {
	console.log('makeIndex(): generating index.');
	if (!ss.courses)
	{
		console.log('ss.courses not found, aborting makeIndex().');
		return;
	}
	
	var course_num = ss.courses.length;
	console.log("course len: ", course_num);
	return;
	
	//ss.courseIndex=
	
}

if (!ss.courses)
{
	console.log("Large course object not found, fetching new courses.json");
	getCourses();
} else {
	console.log('ss.courses found: ', ss.courses);
}

/*
 * Execution
 */

//tabs.open("http://catalog.uah.edu/content.php?catoid=11&navoid=212");
tabs.open("about:addons");

/*
menuitem.Menuitem({
	id: "clickme",
	menuid: "menu_ToolsPopup",
	label: "Chevaline Alpha",
	onCommand: function() {
		alert("here!");
	},
	insertbefore: "menu_pageInfo"
});
*/

pageMod.PageMod({
	include: "*.uah.edu",
	contentScriptWhen: "end",
	contentScriptFile: [self.data.url("jquery-2.1.3.min.js"), self.data.url("courses.js"), self.data.url("uah_page.js")]
});






