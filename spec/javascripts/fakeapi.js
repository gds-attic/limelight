define([
  'fakeapi/licensing/totalapplications',
  'jquerymockjax'
],
function (applicationsResponse) {
  
  var backdropUrl = $('#wrapper').data('backdrop-url');
  if (!window.jasmine && backdropUrl && backdropUrl.indexOf('//fakeapi') == -1) {
    // use real API
    return;
  }
  
  $.mockjaxSettings.log = true;
  $.mockjaxSettings.responseTime = 300;
  $.mockjax(applicationsResponse);
});