define([
  'extensions/collections/availability-for-24-hours',
  'extensions/views/single-stat'
], function (
    AvailabilityFor24Hours,
    SingleStatView) {
  return function () {
    var availabilityCollection = new AvailabilityFor24Hours(null, {
      serviceName:"lasting-power-of-attorney",
      checkName:"lpa"
    });
    var uptimeView = new SingleStatView({
      collection:availabilityCollection,
      el:$('#uptime'),
      getStatFunction:function (collection) {
        return Math.round(collection.getPercentageOfUptime()) + '%';
      }
    });
    var responseTimeView = new SingleStatView({
      collection:availabilityCollection,
      el:$('#response-time'),
      getStatFunction:function (collection) {
        return Math.round(collection.getAverageResponseTime()) + 'ms';
      }
    });
    availabilityCollection.fetch();
  }
});