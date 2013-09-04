define([
  'require',
  'vehicle-licensing/collections/services',
  'extensions/views/timeseries-graph/stacked-graph',
  './vehicle-license-volumes-module'
], function (require,
  ServicesCollection, StackedGraph, volumesModule) {

  return function () {

    if (!$('.lte-ie8').length) {
      var servicesCollection = new ServicesCollection([], {});
      var servicesGraph = new StackedGraph({
        el: $('#vehicle-licensing-services'),
        collection: servicesCollection,
        valueAttr: 'volume:sum',
        showLineLabels: true,
        lineLabelLinks: true
      });
      servicesCollection.fetch();
    }

    volumesModule('#vehicle-licensing-channels');
  };
});
