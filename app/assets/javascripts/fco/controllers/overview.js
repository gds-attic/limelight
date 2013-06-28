define([
  'extensions/collections/graphcollection',
  'fco/collections/conversion-series',
  'extensions/views/conversion-graph/conversion-graph',
  'extensions/views/conversion-success-rate',
  'extensions/collections/visitors-realtime',
  'extensions/views/visitors-realtime',
  'fco/collections/fco-availability-for-24-hours',
  'extensions/views/single-stat'
], function (GraphCollection,
             ConversionCollection, ConversionGraph,
             SuccessRateView,
             VisitorsRealtimeCollection, VisitorsRealtimeView,
             FCO24HourAvailabilityCollection, SingleStatView) {
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
      collection: conversionCollection.collectionInstances[1],
      startStep: serviceName + ':start',
      endStep: serviceName + ':done'
    });

    conversionCollection.fetch();

    if ($('#number-of-visitors-realtime').length) {
      var updateInterval = 120 * 1000;
      var visitorsRealtimeCollection = new VisitorsRealtimeCollection([], {
        serviceName: serviceName
      });

      var visitorsRealtimeView = new VisitorsRealtimeView({
        el: $('#number-of-visitors-realtime'),
        collection: visitorsRealtimeCollection,
        collectionUpdateInterval: updateInterval
      });

      visitorsRealtimeCollection.fetch();

      setInterval(function () {
        visitorsRealtimeCollection.fetch();
      }, updateInterval);
    }

    if ($('#uptime').length) {
      var availabilityCollection = new FCO24HourAvailabilityCollection(null, {
        service: serviceName,
        checkName: serviceName
      });

      new SingleStatView({
        $el: $('#uptime'),
        collection: availabilityCollection,
        getStatFunction: function (c) { return Math.round(c.getPercentageOfUptime()) + '%'; }
      });

      availabilityCollection.fetch();
    }
  };
});
