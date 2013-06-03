define(['jquery'], function ($) {
  return function () {
    $('#global-browser-prompt')
    .prepend('<p>Your browser is unable to display some of the content on this page.</p>');
  }
});
