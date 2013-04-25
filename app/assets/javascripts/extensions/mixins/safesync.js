define([
  'backbone'
], function (Backbone) {

  var mapRecursive = function(object, func) {
    var recur = function (object) {
      if (_.isArray(object)) {
        return _.map(object, recur);
      }

      if (_.isObject(object)) {
        return _.reduce(object, function (memo, value, key) {
          memo[key] = recur(value);
          return memo;
        }, {});
      }

      return func(object);
    };

    return recur(object);
  };

  var escapeHtml = function (object) {
    return mapRecursive(object, function (value) {
      if (_.isString(value)) {
        return _.escape(value);
      }
      return value;
    });
  };

  var SafeSync = {};

  SafeSync.sync = function (method, model, options) {
    var success = options.success;
    options.success = function (resp, status, xhr) {
      var escaped = escapeHtml(resp);
      success(escaped, status, xhr);
    };
    Backbone.sync.apply(this, arguments);
  };

  return SafeSync;
});
