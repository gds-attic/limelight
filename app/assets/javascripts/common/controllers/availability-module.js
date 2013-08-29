define([
  'extensions/collections/graphcollection',
  'extensions/collections/availability-for-24-hours',
  'extensions/views/availability/uptime-number',
  'extensions/views/availability/uptime-graph',
  'extensions/views/availability/response-time-number',
  'extensions/views/availability/response-time-graph'
],
function (GraphCollection, AvailabilityCollection,
          UptimeNumber, UptimeGraph,
          ResponseTimeNumber, ResponseTimeGraph) {

  return function (serviceName, locator) {

    if ($('.lte-ie8').length) {
      // do not attempt to show graphs in legacy IE
      return;
    }

    locator = locator || '#availability'
    var moduleEl = $(locator);
    if (!moduleEl.length) {
      return;
    }

    var availabilityCollection = new AvailabilityCollection(null, {
      serviceName: serviceName
    });

    new UptimeNumber({
      el: moduleEl.find('.uptime'),
      collection: availabilityCollection
    });

    new UptimeGraph({
      el: moduleEl.find('.uptime-graph'),
      collection: availabilityCollection
    });

    new ResponseTimeNumber({
      el: moduleEl.find('.response-time'),
      collection: availabilityCollection
    });

    new ResponseTimeGraph({
      el: moduleEl.find('.response-time-graph'),
      collection: availabilityCollection
    });

    availabilityCollection.fetch();
  };
  
});
