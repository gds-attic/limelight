define([
  'require',
  'extensions/collections/graphcollection',
  './applications-total-weekly',
  './applications-top5authorities-weekly'
],
function (require, GraphCollection, Total, ByAuthority) {
  
  var TotalAndByAuthority = GraphCollection.extend({
    
    collections: [Total, ByAuthority],
    
    /**
     * Combines total applications and applications by authority.
     */
    parse: function () {
      var totalCollection = this.collectionInstances[0];
      var byAuthorityCollection = this.collectionInstances[1];
      
      var data = byAuthorityCollection.clone();
      data.unshift(new this.model({
        id: 'total',
        title: 'Total submissions',
        values: totalCollection.models
      }, { parse: true }));
      
      return data.models;
    }
    
  });
  
  return TotalAndByAuthority;
});
