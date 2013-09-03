define([
  'require',
  'vehicle-licensing/collections/services',
  'vehicle-licensing/views/timeseries-graph',
  './vehicle-license-volumes-module'
], function (require,
  ServicesCollection, TimeseriesGraph, volumesModule) {

  return function () {

    if (!$('.lte-ie8').length) {
      var servicesCollection = new ServicesCollection([], {});
      var servicesGraph = new TimeseriesGraph({
        el: $('#vehicle-licensing-services'),
        collection: servicesCollection,
        valueAttr: 'volume:sum',
        lineLabelLinks: true
      });
      servicesCollection.fetch();
    }

    volumesModule('#vehicle-licensing-channels');
  };
});
