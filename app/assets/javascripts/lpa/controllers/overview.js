define([
  'lpa/collections/application-method-over-time',
  'lpa/views/timeseries-graph/timeseries-graph',
  'extensions/collections/availability-for-24-hours',
  'extensions/views/single-stat'
],
function (ApplicationsCollection, ApplicationsGraph,
          AvailabilityFor24Hours, SingleStatView) {
  return function () {

    if (!$('.lte-ie8').length && $('#application-method-over-time').length) {
      var applicationsCollection = new ApplicationsCollection();

      var graphView = new ApplicationsGraph({
        el: $('#application-method-over-time'),
        collection: applicationsCollection
      });

      applicationsCollection.fetch();
    }

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
