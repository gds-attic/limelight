define(['jquery'], function ($) {
  return function () {
    if ($('html').hasClass('lte-ie8')) {
      $('#global-browser-prompt')
        .prepend('<p>Your browser is unable to display some of the content on this page.</p>');
    }
  }
});
