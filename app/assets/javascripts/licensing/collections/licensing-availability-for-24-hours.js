define([
  'extensions/collections/collection'
],
function (Collection) {
  var LicensingAvailabilityFor24HoursCollection = Collection.extend({

    serviceName: 'licensing',
    apiName: 'monitoring',

    queryParams: function () {
      return {
        filter_by: "check:licensing",
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
  return LicensingAvailabilityFor24HoursCollection;
});
