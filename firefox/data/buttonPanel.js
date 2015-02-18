// Middleware script for buttonPanel

var debug = false;

var ssoForm = new Object();
ssoForm.submit = $('#sso_form_submit');
//ssoForm.user = $('#sso_form_user');
ssoForm.pass = $('#sso_form_pass');

$('#do_testCall').click(function () {
	self.port.emit('testCall');
});

ssoForm.submit.click(function () {
  //console.log('Submitting new SSO account');
  //var user = ssoForm.user.val();
  var pass = ssoForm.pass.val();
  //console.log("sending credentials: " + pass);
  self.port.emit('sso_set', pass);
  ssoForm.pass.val('');
});

$('#do_test_getCredentials').click(function () {
  //self.port.emit('test_getCredentials');
});

$('#do_test_rmCredentials').click(function () {
  //self.port.emit('test_rmCredentials');
});

