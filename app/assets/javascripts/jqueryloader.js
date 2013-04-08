/**
 * Shim to provide global jQuery as an AMD module.
 */
define(function () {
  // This workaround is necessary because the Static project includes jQuery
  // manually but the jquery.mousewheel plugin defines a 'jquery' AMD
  // dependency when it detects require.js to be present.
  return window.jQuery;
});
