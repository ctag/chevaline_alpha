
var keepaliveCount = 0;
var URL2 = "https://sierra.uah.edu:9021/PROD/twbkwbis.P_GenMenu?name=bmenu.P_MainMnu";
var URL1 = "https://uah.instructure.com";
var xhr1 = new XMLHttpRequest();
var xhr2 = new XMLHttpRequest();

console.log("extension startup.");
chrome.alarms.create("newAlarm" , {periodInMinutes : 0.5} );

//example of using a message handler from the inject scripts
chrome.extension.onMessage.addListener(
	function(request, sender, sendResponse) {
	chrome.pageAction.show(sender.tab.id);
	sendResponse();
});

/*
chrome.runtime.onStartup.addListener(
	function () {
		console.log("extension startup via listener.");
		chrome.alarms.create("newAlarm" , {periodInMinutes : 1.0} );
	}
);
*/

chrome.alarms.onAlarm.addListener(function (alarm) {
	
	console.log("sending URL1 request");
	
	xhr1.open("GET", URL1, false);
	
	xhr1.addEventListener("load", function () {
		console.log("URL1 complete.");
		console.log("URL1, response: " + xhr1.responseURL);
		console.log("URL1, status: " + xhr1.status);
	}, false);
	
	/*
	xhr1.onreadystatechange = function() {
		//console.dir(xhr);
		console.log("URL1, readyState: " + xhr1.readyState);
		console.log("URL1, response: " + xhr1.responseURL);
		console.log("URL1, status: " + xhr1.status);
	}
	*/
	
	xhr1.send();
});


chrome.alarms.onAlarm.addListener(function (alarm) {
	
	console.log("sending URL2 request");
	
	xhr2.open("GET", URL2, false);
	
	xhr2.addEventListener("load", function () {
		console.log("URL2 complete.");
		console.log("URL2, response: " + xhr2.responseURL);
		console.log("URL2, status: " + xhr2.status);
	}, false);
	
	/*
	xhr2.onreadystatechange = function() {
		//console.dir(xhr);
		console.log("URL2, readyState: " + xhr2.readyState);
		console.log("URL2, response: " + xhr2.responseURL);
		console.log("URL2, status: " + xhr2.status);
	}
	*/
	xhr2.send();
});





