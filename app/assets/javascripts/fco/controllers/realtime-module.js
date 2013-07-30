define([
  'extensions/collections/visitors-realtime',
  'extensions/views/visitors-realtime'
],
function (VisitorsRealtimeCollection, VisitorsRealtimeView) {

  return function (serviceName) {
    if (!$('#number-of-visitors-realtime').length) {
      return;
    }

    var updateInterval = 120 * 1000;
    var visitorsRealtimeCollection = new VisitorsRealtimeCollection([], {
      serviceName: serviceName
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
  };
});
