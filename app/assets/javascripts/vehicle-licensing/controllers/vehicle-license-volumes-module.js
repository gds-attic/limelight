define([
  'vehicle-licensing/collections/volumetrics',
  'extensions/views/timeseries-graph/stacked-graph',
  'extensions/views/tabs',
  'extensions/views/graph/headline',
],
function (VolumetricsCollection, StackedGraph, Tabs, Headline) {
  return function (selector, type) {
    if ($('.lte-ie8').length) {
      // do not attempt to show graphs in legacy IE
      return;
    }

    var volumetricsCollection = new VolumetricsCollection([], {
      type: type
    });
    volumetricsCollection.fetch();

    new StackedGraph({
      el: $(selector),
      collection: volumetricsCollection,
      valueAttr: 'volume:sum',
      showLineLabels: true
    });
  };
});
