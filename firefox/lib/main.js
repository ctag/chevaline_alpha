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
const {XMLHttpRequest} = require("sdk/net/xhr");

/*
 * Global Variables
 */
var keepaliveCount = 0;
var URL1 = "https://sierra.uah.edu:9021/PROD/twbkwbis.P_GenMenu?name=bmenu.P_MainMnu";
var URL2 = "https://uah.instructure.com";
var intervalId = timers.setInterval(keepaliveCall, 1000 * 20);

/*
 * Setup code
 */
console.log("intervalId: " + intervalId);

/**
*
*  Base64 encode / decode
*  http://www.webtoolkit.info/
*
**/
var Base64 = {

// private property
_keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

// public method for encoding
encode : function (input) {
    var output = "";
    var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
    var i = 0;

    input = Base64._utf8_encode(input);

    while (i < input.length) {

        chr1 = input.charCodeAt(i++);
        chr2 = input.charCodeAt(i++);
        chr3 = input.charCodeAt(i++);

        enc1 = chr1 >> 2;
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        enc4 = chr3 & 63;

        if (isNaN(chr2)) {
            enc3 = enc4 = 64;
        } else if (isNaN(chr3)) {
            enc4 = 64;
        }

        output = output +
        this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
        this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

    }

    return output;
},

// public method for decoding
decode : function (input) {
    var output = "";
    var chr1, chr2, chr3;
    var enc1, enc2, enc3, enc4;
    var i = 0;

    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

    while (i < input.length) {

        enc1 = this._keyStr.indexOf(input.charAt(i++));
        enc2 = this._keyStr.indexOf(input.charAt(i++));
        enc3 = this._keyStr.indexOf(input.charAt(i++));
        enc4 = this._keyStr.indexOf(input.charAt(i++));

        chr1 = (enc1 << 2) | (enc2 >> 4);
        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
        chr3 = ((enc3 & 3) << 6) | enc4;

        output = output + String.fromCharCode(chr1);

        if (enc3 != 64) {
            output = output + String.fromCharCode(chr2);
        }
        if (enc4 != 64) {
            output = output + String.fromCharCode(chr3);
        }

    }

    output = Base64._utf8_decode(output);

    return output;

},

// private method for UTF-8 encoding
_utf8_encode : function (string) {
    string = string.replace(/\r\n/g,"\n");
    var utftext = "";

    for (var n = 0; n < string.length; n++) {

        var c = string.charCodeAt(n);

        if (c < 128) {
            utftext += String.fromCharCode(c);
        }
        else if((c > 127) && (c < 2048)) {
            utftext += String.fromCharCode((c >> 6) | 192);
            utftext += String.fromCharCode((c & 63) | 128);
        }
        else {
            utftext += String.fromCharCode((c >> 12) | 224);
            utftext += String.fromCharCode(((c >> 6) & 63) | 128);
            utftext += String.fromCharCode((c & 63) | 128);
        }

    }

    return utftext;
},

// private method for UTF-8 decoding
_utf8_decode : function (utftext) {
    var string = "";
    var i = 0;
    var c = c1 = c2 = 0;

    while ( i < utftext.length ) {

        c = utftext.charCodeAt(i);

        if (c < 128) {
            string += String.fromCharCode(c);
            i++;
        }
        else if((c > 191) && (c < 224)) {
            c2 = utftext.charCodeAt(i+1);
            string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
            i += 2;
        }
        else {
            c2 = utftext.charCodeAt(i+1);
            c3 = utftext.charCodeAt(i+2);
            string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
            i += 3;
        }

    }

    return string;
}

}


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

/*
 * Name/key pairs
 * 'username'
 * 'password'
 * 'warn'
 * url: /cas/login?service=https%3A%2F%2Fuah.instructure.com%2Flogin%2Fcas
 * method: post
 */
function loginRequest () {
	urlRequest.Request({
	url: "https://sso.uah.edu/cas/login?service=https%3A%2F%2Fuah.instructure.com%2Flogin%2Fcas",
	content: "username=0019&password=&warn=true",
	onComplete: function (response) {
		keepaliveCount++;
		console.log("LoginRequest completed:", response.status, ". keepaliveCount:", keepaliveCount);
	}
	}).post();
} /*end makeRequest*/

function rawLoginRequest () {
	var http = new XMLHttpRequest();
	var username = "0019";
	var password = "";
	var url="https://sso.uah.edu/cas/login?service=https%3A%2F%2Fuah.instructure.com%2Flogin%2Fcas";
	var params="username=0019&password=";
	//http.open("POST", url, true, "0019", "");
	http.open("POST", url, true);
	
	//Send the proper header information along with the request
	//http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	http.setRequestHeader("Content-type", "text/html; charset=utf-8");
	http.setRequestHeader("Authorization", "Basic " + Base64.encode(username) + ":" + Base64.encode(password));
	//http.setRequestHeader("Content-length", params.length);
	//http.setRequestHeader("Connection", "close");
	
	http.onreadystatechange = function() { // Call a function when the state changes.
		if(http.readyState == 4 && http.status == 200) {
			//console.log("repsonse: ", http.responseText);
		}
		console.log("status: ", http.status);
	}
	http.send();
} /*end makeRequest*/

function keepaliveCall(){
	//makeRequest(URL1);
	//makeRequest(URL2);
	rawLoginRequest();
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








