define([ 'require', 'jquery' ], function (require, $) {
  var controller = $('#wrapper').data('controller');
  require([ controller ]);
});
