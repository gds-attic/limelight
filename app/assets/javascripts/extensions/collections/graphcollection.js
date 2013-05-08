define([
  'require',
  './multicollection',
  'extensions/models/group'
],
function (require, MultiCollection, Group) {
  /**
   * Helper class. Graphs expect a collection of `Group` models, each of which
   * containing a data series. This collection combines one or more single
   * data series into a Graph-compatible collection of collections.
   */
  var GraphCollection = MultiCollection.extend({
    model: Group,
    
    parse: function () {
      return _.map(this.collectionInstances, function (collection) {
        return {
          values: collection.models
        };
      });
    }
  });
  
  return GraphCollection;
});


