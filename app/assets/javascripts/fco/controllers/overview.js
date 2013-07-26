define([
  'extensions/collections/graphcollection',
  'extensions/collections/multiconversioncollection',
  'fco/collections/conversion-series',
  'extensions/views/conversion-graph/conversion-graph',
  'extensions/views/conversion-success-rate',
  'extensions/collections/visitors-realtime',
  'extensions/views/visitors-realtime',
  'fco/collections/volumetrics',
  'fco/views/volumetrics-submissions-graph',
  'fco/views/volumetrics-submissions-number',
  'fco/views/volumetrics-completion-graph',
  'fco/views/volumetrics-completion-number',
  'extensions/collections/availability-for-24-hours',
  'extensions/views/single-stat'
], function (GraphCollection,
             MultiConversionCollection,
             ConversionCollection, ConversionGraph,
             SuccessRateView,
             VisitorsRealtimeCollection, VisitorsRealtimeView,
             VolumetricsCollection,
             VolumetricsSubmissionsGraph, VolumetricsSubmissionsNumberView,
             VolumetricsCompletionGraph, VolumetricsCompletionNumberView,
             FCO24HourAvailabilityCollection, SingleStatView) {
  return function () {

    var serviceName = $("#wrapper").data("service-name");

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

    if ($('#number-of-visitors-realtime').length) {
      var updateInterval = 120 * 1000;
      var visitorsRealtimeCollection = new VisitorsRealtimeCollection([], {
        serviceName:serviceName
      });

      var visitorsRealtimeView = new VisitorsRealtimeView({
        el:$('#number-of-visitors-realtime'),
        collection:visitorsRealtimeCollection,
        collectionUpdateInterval:updateInterval
      });

      visitorsRealtimeCollection.fetch();

      setInterval(function () {
        visitorsRealtimeCollection.fetch();
      }, updateInterval);
    }

    var volumetricsCollection = new VolumetricsCollection([], {
      serviceName:serviceName
    });

    var volumetricsSubmissions = new GraphCollection();
    volumetricsCollection.on('reset', function () {
      volumetricsSubmissions.reset([volumetricsCollection.applicationsSeries()]);
    });

    var volumetricsCompletion = new GraphCollection();
    volumetricsCollection.on('reset', function () {
      volumetricsCompletion.reset([volumetricsCollection.completionSeries()]);
    });

    var relayed = false;
    volumetricsSubmissions.on('change:selected', function (group, groupIndex, model, index) {
      if (relayed) {
        relayed = false;
      } else {
        relayed = true;
        volumetricsCompletion.selectItem(groupIndex, index);
      }
    });
    volumetricsCompletion.on('change:selected', function (group, groupIndex, model, index) {
      if (relayed) {
        relayed = false;
      } else {
        relayed = true;
        volumetricsSubmissions.selectItem(groupIndex, index);
      }
    });

    var volumetricsSubmissionsNumber = new VolumetricsSubmissionsNumberView({
      collection:volumetricsSubmissions,
      el:$('#volumetrics-submissions-selected')
    });

    var volumetricsSubmissionsGraph = new VolumetricsSubmissionsGraph({
      el:$('#volumetrics-submissions'),
      collection:volumetricsSubmissions,
      valueAttr:'uniqueEvents'
    });

    var volumetricsCompletionNumber = new VolumetricsCompletionNumberView({
      collection:volumetricsCompletion,
      el:$('#volumetrics-completion-selected')
    });

    var volumetricsCompletionGraph = new VolumetricsCompletionGraph({
      el:$('#volumetrics-completion'),
      collection:volumetricsCompletion,
      valueAttr:'completion'
    });

    volumetricsCollection.fetch();

    if ($('#uptime').length && $('#response-time').length) {
      var availabilityCollection = new FCO24HourAvailabilityCollection(null, {
        serviceName:serviceName,
        checkName:serviceName
      });

      new SingleStatView({
        $el:$('#uptime'),
        collection:availabilityCollection,
        getStatFunction:function (c) {
          return Math.round(c.getPercentageOfUptime()) + '%';
        }
      });

      new SingleStatView({
        $el: $('#response-time'),
        collection: availabilityCollection,
        getStatFunction: function (c) { return Math.round(c.getAverageResponseTime()) + 'ms'; }
      });

      availabilityCollection.fetch();
    }

  };
});
