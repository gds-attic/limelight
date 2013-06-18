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
        options: { weeksAgo: 1 }
      },
      {
        collection: ConversionSeriesCollection,
        options: { weeksAgo: 0 }
      }
    ]
  });
  return ConversionCollection;
});
