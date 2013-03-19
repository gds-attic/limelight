define([
  'jquerymockjax',
  'fakeapi/licensing/perlicence',
  'fakeapi/licensing/applications'
],
function () {
  
  var backdropUrl = $('#wrapper').data('backdrop-url');
  if (!window.jasmine && backdropUrl && backdropUrl.indexOf('//fakeapi') == -1) {
    // use real API
    return;
  }
  
  $.mockjaxSettings.log = true;
  $.mockjaxSettings.responseTime = 300;
  
  var responses = Array.prototype.slice.call(arguments, 1);
  for (var i = 0, ni = responses.length; i < ni; i++) {
    var response = new responses[i]()
    $.mockjax(response.getDefinition());
  };
});