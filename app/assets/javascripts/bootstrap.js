define([ 'require', 'jquery' ], function (require, $) {
  var controller = $('#wrapper').data('controller'),
      preProcessors = $('#wrapper').data('preprocessors'),
      modules = [];

  if (preProcessors) {
    $.each(preProcessors.split(','), function (i, preProcessor) {
      modules.push("licensing/controllers/preprocessors/" + preProcessor);
    })
  }

  modules.push(controller);

  require(modules, function () {
    var args = Array.prototype.slice.call(arguments);
    $.each(args, function (i, func) {
      if (!_.isFunction(func)) {
        throw "Module " + modules[i] + " does not return a function";
      }
      func();
    });
  });
});
