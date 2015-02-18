
var tabs = require("sdk/tabs");
var pageMod = require("sdk/page-mod");
var self = require("sdk/self");
var favicons = require("sdk/places/favicon");
var timers = require("sdk/timers");
var urlRequest = require("sdk/request");
var simplePrefs = require('sdk/simple-prefs');
var ss = require('sdk/simple-storage');
const {XMLHttpRequest} = require("sdk/net/xhr");


var lib = require("./lib.js");

ss.tester = "hi";

// Doesn't work
//var data = require("../data/data.js");


console.log("main.js running.");

lib.report();

/*
pageMod.PageMod({
	include: "*.uah.edu",
	contentScriptFile: [self.data.url("jquery-2.1.3.min.js"), self.data.url("data.js")]
});
*/




