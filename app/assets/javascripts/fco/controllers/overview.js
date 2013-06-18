define([
  'extensions/collections/graphcollection',
  'fco/collections/conversion-series',
  'extensions/views/conversion-graph/conversion-graph',
  'extensions/views/conversion-success-rate'
], function (GraphCollection, ConversionCollection, ConversionGraph, SuccessRateView) {
  return function () {

    var serviceName = $("#wrapper").data("service-name");

    var conversionCollection = new GraphCollection(null, {
      collections: [
        {collection: ConversionCollection, options: {weeksAgo: 1}},
        {collection: ConversionCollection, options: {weeksAgo: 0}}
      ],
      serviceName: serviceName
    });

    if (!$('.lte-ie8').length) {
      var conversionGraph = new ConversionGraph({
        el: $('#applications-conversion-graph'),
        collection: conversionCollection
      });
    }

    var successRate = new SuccessRateView({
      el: $('#applications-success-rate'),
      collection: conversionCollection.collectionInstances[0],
      startStep: serviceName + ':start',
      endStep: serviceName + ':done'
    });

    conversionCollection.fetch();
  };
});
