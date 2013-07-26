define([
  'lpa/collections/application-method-over-time',
  'lpa/views/timeseries-graph/timeseries-graph',
  'extensions/collections/multiconversioncollection',
  'lpa/collections/conversion-series',
  'extensions/views/conversion-graph/conversion-graph',
  'extensions/collections/availability-for-24-hours',
  'extensions/views/single-stat'
],
function (ApplicationsCollection, ApplicationsGraph,
          MultiConversionCollection, ConversionSeries, ConversionGraph,
          AvailabilityFor24Hours, SingleStatView) {
  return function () {

    if (!$('.lte-ie8').length) {

      if ($('#application-method-over-time').length) {
        var applicationsCollection = new ApplicationsCollection();

        var graphView = new ApplicationsGraph({
          el: $('#application-method-over-time'),
          collection: applicationsCollection
        });

        applicationsCollection.fetch();
      }

      if ($('#lpa-conversion-graph').length) {
        var conversionCollection = new MultiConversionCollection(null, {
          conversionCollection: ConversionSeries
        });

        var conversionGraph = new ConversionGraph({
          el: $('#lpa-conversion-graph'),
          collection: conversionCollection
        });

        conversionCollection.fetch();
      }
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
