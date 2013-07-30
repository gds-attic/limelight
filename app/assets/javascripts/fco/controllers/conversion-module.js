define([
  'extensions/collections/graphcollection',
  'extensions/collections/multiconversioncollection',
  'fco/collections/conversion-series',
  'extensions/views/conversion-graph/conversion-graph',
  'extensions/views/conversion-success-rate'
],
function (GraphCollection, MultiConversionCollection,
          ConversionCollection, ConversionGraph, SuccessRateView) {

  return function (serviceName) {

    var conversionCollection = new MultiConversionCollection(null, {
      conversionCollection: ConversionCollection,
      serviceName: serviceName
    });

    if (!$('.lte-ie8').length) {
      var conversionGraph = new ConversionGraph({
        el:$('#applications-conversion-graph'),
        collection:conversionCollection
      });
    }

    conversionCollection.fetch();
  };
});
