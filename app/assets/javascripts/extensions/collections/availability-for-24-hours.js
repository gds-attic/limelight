define([
  'extensions/collections/graphcollection'
],
function (GraphCollection) {
  var AvailabilityFor24HoursCollection = GraphCollection.extend({

    initialize: function (models, options) {
      if (!_.isString(options.serviceName)) {
        throw "options argument has no serviceName property";
      }
      this.serviceName = options.serviceName;
      GraphCollection.prototype.initialize.apply(this, arguments);
    },

    serviceName: undefined,
    apiName: 'monitoring',

    queryParams: function () {
      return {
        sort_by: "_timestamp:descending",
        limit: 24
      };
    },

    parse: function (response) {
      var data = response.data;
      _.each(data, function (d) {
        d.total = d.downtime + d.uptime;
        d.uptimeFraction = d.uptime / d.total;
        d._end_at = this.moment(d._timestamp);
        d._start_at = this.moment(d._timestamp).subtract(1, "hours");
      });
      return {
        id: 'availability',
        title: 'Availability',
        values: data
      };
    },

    _getTotalUptime: function () {
      return this.at(0).get('values').reduce(function (memo, model) {
        return memo + model.get('uptime');
      }, 0)
    },

    _getTotalTime: function ( includeUnmonitored ) {
      return this.at(0).get('values').reduce(function (memo, model) {
        var res = memo + model.get('total');
        if (includeUnmonitored) {
          res += model.get('unmonitored');
        }
        return res;
      }, 0)
    },

    getFractionOfUptime: function () {
      return this._getTotalUptime() / this._getTotalTime();
    },

    getAverageResponseTime: function () {
      var values = this.at(0).get('values');
      var total = values.reduce(function (memo, model) {
        return memo + model.get('avgresponse');
      }, 0);
      return total / values.length;
    }

  });

  return AvailabilityFor24HoursCollection;
});
