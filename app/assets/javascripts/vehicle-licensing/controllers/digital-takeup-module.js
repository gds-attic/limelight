define([
  'vehicle-licensing/collections/digital-takeup',
  'extensions/views/timeseries-graph/percentage-graph',
  'vehicle-licensing/views/digital-takeup-number',
  'extensions/views/tabs',
  'extensions/views/graph/headline',
],
  function (DigitalTakeupCollection, PercentageGraph, DigitalTakeupNumberView, Tabs, Headline) {
    return function (selector, type) {
      if ($('.lte-ie8').length) {
        // do not attempt to show graphs in legacy IE
        return;
      }

      var digitalTakeupCollection = new DigitalTakeupCollection([], {
        type: type
      });
      digitalTakeupCollection.fetch();

      new PercentageGraph({
        el: $(selector),
        collection: digitalTakeupCollection,
        valueAttr: 'fraction'
      });

      new DigitalTakeupNumberView({
        el: $(selector + '-number'),
        collection: digitalTakeupCollection
      });
    };
  });
