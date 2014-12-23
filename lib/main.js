var tabs = require("sdk/tabs");
var pagemod = require("sdk/page-mod");
var self = require("sdk/self");
var favicons = require("sdk/places/favicon");
var timers = require("sdk/timers");
var urlRequest = require("sdk/request");
var simplePrefs = require('sdk/simple-prefs');
//var loginUrl = simplePrefs.prefs['loginUrl'];
//var keepaliveUrl = simplePrefs.prefs['keepaliveUrl'];
//var logoutUrl = simplePrefs.prefs['logoutUrl'];

var keepaliveCount = 0;


var keepaliveURL = "https://sierra.uah.edu:9021/PROD/twbkwbis.P_GenMenu?name=bmenu.P_MainMnu";

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

var intervalId = timers.setInterval(keepaliveCall, 1000 * 30);
console.log("intervalId: " + intervalId);

function keepaliveCall(){
	//console.log("keepaliveCall: " + keepaliveURL)
	urlRequest.Request({
	url: keepaliveURL,
	onComplete: function (response) {
		keepaliveCount++;
		console.log("keepaliveCall completed:", response.status, ". keepaliveCount:", keepaliveCount);
	}
	}).get();
}



// not logged in
//https://sierra.uah.edu:9021/PROD/twbkwbis.P_GenMenu?name=homepage

// logged in
// https://sierra.uah.edu:9021/PROD/twbkwbis.P_GenMenu?name=bmenu.P_MainMnu&msg=WELCOME+Welcome,+Christopher+S.+Bero,+to+the+UAH+Self+Service+System!Dec+19,+201411%3A37+am








