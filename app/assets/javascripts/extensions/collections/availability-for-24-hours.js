define([
  'extensions/collections/collection'
],
function (Collection) {
  var AvailabilityFor24HoursCollection = Collection.extend({

    initialize: function (models, options) {
      if (!_.isString(options.serviceName)) {
        throw "options argument has no serviceName property";
      }
      if (!_.isString(options.checkName)) {
        throw "options argument has no checkName property";
      }
      this.serviceName = options.serviceName;
      this.checkName = options.checkName;
      Collection.prototype.initialize.apply(this, arguments);
    },

    serviceName: undefined,
    checkName: undefined,
    apiName: 'monitoring',

    queryParams: function () {
      return {
        filter_by: "check:" + this.checkName,
        sort_by: "_timestamp:descending",
        limit: 24
      };
    },

    _getTotalUptime: function () {
      var data = this.pluck('data')[0];
      var total = 0;
      for (var i = 0, len = data.length; i < len; i++) {
        total += data[i]['uptime'];
      }
      return total;
    },

    _getTotalTime: function () {
      var data = this.pluck('data')[0];
      var total = 0;
      for (var i = 0, len = data.length; i < len; i++) {
        total += data[i]['downtime'];
        total += data[i]['unmonitored'];
        total += data[i]['uptime'];
      }
      return total;
    },

    getPercentageOfUptime: function () {
      return 100 * (this._getTotalUptime() / this._getTotalTime());
    },

    getAverageResponseTime: function () {
      var data = this.pluck('data')[0];
      var length = data.length;
      var total = 0;
      for (var i = 0; i < length; i++) {
        total += data[i]['avgresponse'];
      }
      return (total / length);
    }

  });

  return AvailabilityFor24HoursCollection;
});
