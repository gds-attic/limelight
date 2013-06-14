define([
  'require',
  './conversion-series',
  'extensions/collections/graphcollection'
],
function (require, ConversionSeriesCollection, GraphCollection) {

  var ConversionCollection = GraphCollection.extend({
    collections: [
      {
        collection: ConversionSeriesCollection,
        options: { monthsAgo: 1 }
      },
      {
        collection: ConversionSeriesCollection,
        options: { monthsAgo: 0 }
      }
    ]
  });
  return ConversionCollection;
});
