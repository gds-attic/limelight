define([
  'lodash',
  'jquerymockjax',
  'fakeapi/licensing/applications-top5-lastmonth',
  'fakeapi/licensing/applications-detail-lastweek',
  'fakeapi/licensing/applications-top5authorities-weekly',
  'fakeapi/licensing/applications-top5licences-weekly',
  'fakeapi/licensing/applications-total-weekly'
],
function (_) {
  // use XMLHttpRequest for cross domain mock calls on IE
  // as mockjax does not replace XDomainRequest
  $.ajaxPrefilter( function( options, originalOptions, jqXHR ) {
    options.crossDomain = false;
  });
  
  $.mockjaxSettings.log = true;
  $.mockjaxSettings.responseTime = 300;
  
  var responses = Array.prototype.slice.call(arguments, 2);
  for (var i = 0, ni = responses.length; i < ni; i++) {
    var response = new responses[i]()
    $.mockjax(_.bind(response.getDefinition, response));
  };
});