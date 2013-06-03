define([ 'require', 'jquery' ], function (require, $) {
  var controller = $('#wrapper').data('controller'),
      preProcessors = $('#wrapper').data('preprocessors'),
      loadThese = [];

  if (preProcessors) {
    $.each(preProcessors.split(','), function (i, preProcessor) {
      loadThese.push("licensing/controllers/preprocessors/" + preProcessor);
    })
  }

  loadThese.push(controller);

  require(loadThese, function () {
    var args = Array.prototype.slice.call(arguments);
    $.each(args, function (i, func) {
      func();
    });
  });
});
