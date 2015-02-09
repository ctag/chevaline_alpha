// Middleware script for buttonPanel

var debug = false;

$('#do_traverseIndex').click(function () {
	console.log("emitting?");
	self.port.emit('doThing');
});




