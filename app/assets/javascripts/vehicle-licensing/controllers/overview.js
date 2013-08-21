define([
  'require',
  'vehicle-licensing/collections/services',
  'vehicle-licensing/collections/channels',
  'vehicle-licensing/views/timeseries-graph'
], function (require,
  ServicesCollection, ChannelsCollection, TimeseriesGraph) {

  return function () {

    if (!$('.lte-ie8').length) {
      var servicesCollection = new ServicesCollection([], {});
      var servicesGraph = new TimeseriesGraph({
        el: $('#vehicle-licensing-services'),
        collection: servicesCollection
      });
      servicesCollection.fetch();
      
      var channelsCollection = new ChannelsCollection([], {});
      var channelsGraph = new TimeseriesGraph({
        el: $('#vehicle-licensing-channels'),
        collection: channelsCollection
      });
      channelsCollection.fetch();
    }
  };
});
