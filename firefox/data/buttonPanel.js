// Middleware script for buttonPanel

var debug = false;

$('#do_traverseIndex').click(function () {
	console.log("emitting?");
	self.port.emit('doThing');
});

$('#sso_form_submit').click(function () {
  console.log('Submitting new SSO account');
  var user = $('#sso_form_user').val();
  var pass = $('#sso_form_pass').val();
  console.log("sending credentials: " + user + ", " + pass);
  self.port.emit('sso_create', user, pass);
});


