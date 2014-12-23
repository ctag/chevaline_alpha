/*
 * WTF-UAH
 * A Firefox extension
 * By: Christopher [ctag] Bero
 * 
 * Made with Charger Pride, I hope you find it utilitous!
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

/*
 * Global Variables
 */
var keepaliveCount = 0;
var URL1 = "https://sierra.uah.edu:9021/PROD/twbkwbis.P_GenMenu?name=bmenu.P_MainMnu";
var URL2 = "https://uah.instructure.com";
var intervalId = timers.setInterval(keepaliveCall, 1000 * 120);

/*
 * Setup code
 */
console.log("intervalId: " + intervalId);


/*
 * Functions
 */
function makeRequest (URL) {
	urlRequest.Request({
	url: URL,
	onComplete: function (response) {
		keepaliveCount++;
		console.log("URL1 keepaliveCall completed:", response.status, ". keepaliveCount:", keepaliveCount);
	}
	}).get();
} /*end makeRequest*/

function keepaliveCall(){
	makeRequest(URL1);
	makeRequest(URL2);
} /*end keepaliveCall*/

/*
//tabs.open('https://sierra.uah.edu:9021/PROD/twbkwbis.P_GenMenu?name=homepage');

function oneTabInfo (tab) {
console.log('ONE TAB INFO');
console.log('tab.title: ' + tab.title);
console.log('tab.window: ' + tab.window);
console.log('tab.id: ' + tab.id);
console.log('tab.url: ' + tab.url);
console.log('favicons.favicon: ' + favicons.getFavicon());
console.log('tab.index: ' + tab.index);
console.log('tab.isPinned: ' + tab.isPinned);
}

function allTabInfo () {
for (let tab of tabs)
{
console.log('ALL TAB INFO');
console.log('tab.title: ' + tab.title);
console.log('tab.window: ' + tab.window);
console.log('tab.id: ' + tab.id);
console.log('tab.url: ' + tab.url);
console.log('favicons.favicon: ' + favicons.getFavicon());
console.log('tab.index: ' + tab.index);
console.log('tab.isPinned: ' + tab.isPinned);
}
} /*end tabInfo*/

/*
tabs.on('open', function(thisTab) {
console.log("tab opened");
});

tabs.on('ready', function(thisTab) {
//alert("hi");
console.log("tab loaded");
oneTabInfo(thisTab);
});

pagemod.PageMod({
	include: "*.localhost",
	contentScript: 'console.log("tab matches ruleset."); alert("page matches ruleset");' +  
			'document.body.innerHTML = "ruleset matched.";'
});
*/



// not logged in
//https://sierra.uah.edu:9021/PROD/twbkwbis.P_GenMenu?name=homepage

// logged in
// https://sierra.uah.edu:9021/PROD/twbkwbis.P_GenMenu?name=bmenu.P_MainMnu&msg=WELCOME+Welcome,+Christopher+S.+Bero,+to+the+UAH+Self+Service+System!Dec+19,+201411%3A37+am








