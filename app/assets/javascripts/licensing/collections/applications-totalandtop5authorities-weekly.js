define([
  'require',
  'extensions/collections/multicollection',
  './applications-total-weekly',
  './applications-top5authorities-weekly'
],
function (require, MultiCollection, Total, ByAuthority) {
  
  var TotalAndByAuthority = MultiCollection.extend({
    
    collections: [Total, ByAuthority],
    
    /**
     * Combines total applications and applications by authority.
     */
    parse: function () {
      var totalCollection = this.collectionInstances[0];
      var byAuthorityCollection = this.collectionInstances[1];
      
      var data = byAuthorityCollection.clone();
      data.unshift(totalCollection.first());
      
      return data.models;
    }
    
  });
  
  return TotalAndByAuthority;
});
