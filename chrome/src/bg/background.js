
var keepaliveCount = 0;
var URL1 = "https://sierra.uah.edu:9021/PROD/twbkwbis.P_GenMenu?name=bmenu.P_MainMnu";
var URL2 = "https://uah.instructure.com";
var xhr = new XMLHttpRequest();

console.log("extension startup.");
chrome.alarms.create("newAlarm" , {periodInMinutes : 0.2} );

//example of using a message handler from the inject scripts
chrome.extension.onMessage.addListener(
	function(request, sender, sendResponse) {
	chrome.pageAction.show(sender.tab.id);
	sendResponse();
});

chrome.runtime.onStartup.addListener(
	function () {
		//console.log("extension startup.");
		//chrome.alarms.create("newAlarm" , {periodInMinutes : 0.2} );
	}
);

chrome.alarms.onAlarm.addListener(function (alarm) {
	
	xhr.open("GET", URL1, true);
	
	xhr.onreadystatechange = function() {
		console.dir(xhr);
		console.log("ready state: " + xhr.readyState);
	}
	xhr.send();
});

chrome.alarms.onAlarm.addListener(function (alarm) {
	
	xhr.open("GET", URL2, true);
	
	xhr.onreadystatechange = function() {
		console.dir(xhr);
		console.log("ready state: " + xhr.readyState);
	}
	xhr.send();
});




