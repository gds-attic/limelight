define([
  'lpa/collections/application-method-over-time',
  'lpa/views/timeseries-graph/timeseries-graph',
  'extensions/collections/multiconversioncollection',
  'lpa/collections/conversion-series',
  'extensions/views/conversion-graph/conversion-graph',
  'common/controllers/availability-module'
],
function (ApplicationsCollection, ApplicationsGraph,
          MultiConversionCollection, ConversionSeries, ConversionGraph,
          availabilityModule) {
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

    availabilityModule('lasting-power-of-attorney');
  }
});
