// Middleware script for buttonPanel


$('#do_traverseIndex').click(function () {
	console.log("emitting?");
	self.port.emit('doThing');
});




