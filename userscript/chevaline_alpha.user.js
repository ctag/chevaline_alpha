// ==UserScript==
// @name                Chevaline Alpha
// @namespace	        http://berocs.com/chevaline
// @description	        Make college great (again?)
// @version				1.0.2
// @match				https://sso.uah.edu/cas/login*
// ==/UserScript==

//
// Helper functions
//

function hasClass(el, className) {
	"use strict";
    return el.classList ? el.classList.contains(className) : new RegExp('\\b' + className + '\\b').test(el.className);
}

function addClass(el, className) {
	"use strict";
    if (el.classList) {
		el.classList.add(className);
	} else if (!hasClass(el, className)) {
		el.className += ' ' + className;
	}
}

function removeClass(el, className) {
	"use strict";
    if (el.classList) {
		el.classList.remove(className);
	} else {
		el.className = el.className.replace(new RegExp('\\b' + className + '\\b', 'g'), '');
	}
}

function addEvent(el, type, handler) {
	"use strict";
    if (el.attachEvent) {
		el.attachEvent('on' + type, handler);
	} else {
		el.addEventListener(type, handler);
	}
}

function removeEvent(el, type, handler) {
	"use strict";
    if (el.detachEvent) {
		el.detachEvent('on' + type, handler);
	} else {
		el.removeEventListener(type, handler);
	}
}


//
// Main script
//

console.log("Chevaline Alpha userscript has been loaded on this page.");

document.getElementById('body').style.background = '#000';

// Fill in stored credentials
if (typeof(localStorage.username === 'string') && typeof(localStorage.password) === 'string') {
	document.getElementById('username').value = localStorage.username;
	document.getElementById('password').value = localStorage.password;
}

// Create save credentials button
var savePassword = document.createElement('input');
var buttonDiv1 = document.createElement('div');
addClass(buttonDiv1, 'row');
addClass(buttonDiv1, 'btn-row');
buttonDiv1.style.marginBottom = '10px';
savePassword.value = "Store Credentials";
addClass(savePassword, 'btn-submit');
savePassword.type = 'submit';
savePassword.title = 'First fill in your username and password, then click this button to save them. Once saved, credentials will be automatically provided on future logins.';
buttonDiv1.appendChild(savePassword);
document.getElementById('login').appendChild(buttonDiv1);

// Create clear credentials button
var buttonDiv2 = document.createElement('div');
addClass(buttonDiv2, 'row');
addClass(buttonDiv2, 'btn-row');
buttonDiv2.style.marginBottom = '10px';
var clearCred = document.createElement('input');
clearCred.value = "Clear Credentials";
addClass(clearCred, 'btn-submit');
clearCred.type = 'submit';
clearCred.title = 'Clear stored credentials.';
buttonDiv2.appendChild(clearCred);
document.getElementById('login').appendChild(buttonDiv2);

//
// Events
//

function handler_store_credentials() {
	var username = document.getElementById('username').value;
	var password = document.getElementById('password').value;
	if (username === '') {
		alert('Username field must be filled.');
		return;
	}
	if (password === '') {
		alert('Password field must be filled.');
		return;
	}
	localStorage.username = username;
 	localStorage.password = password;
}
addEvent(savePassword, 'click', handler_store_credentials);

function handler_clear_credentials() {
	localStorage.removeItem('username');
	localStorage.removeItem('password');
}
addEvent(clearCred, 'click', handler_clear_credentials);

