define([
  'vehicle-licensing/collections/volumetrics',
  'vehicle-licensing/views/timeseries-graph',
  'extensions/views/tabs',
  'extensions/views/graph/headline',
],
function (VolumetricsCollection, TimeseriesGraph, Tabs, Headline) {
  return function (selector, type) {
    if ($('.lte-ie8').length) {
      // do not attempt to show graphs in legacy IE
      return;
    }

    var volumetricsCollection = new VolumetricsCollection([], {
      type: type
    });
    volumetricsCollection.fetch();

    new TimeseriesGraph({
      el: $(selector),
      collection: volumetricsCollection,
      valueAttr: 'volume:sum'
    });
  };
});
