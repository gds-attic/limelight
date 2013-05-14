define([
  'require',
  'extensions/collections/graphcollection',
  './applications-total-weekly',
  './applications-top5licences-weekly'
],
function (require, GraphCollection, Total, ByLicence) {
  
  var TotalAndByLicence = GraphCollection.extend({
    
    collections: [Total, ByLicence],
    
    /**
     * Combines total applications and applications by authority.
     */
    parse: function () {
      var totalCollection = this.collectionInstances[0];
      var byLicenceCollection = this.collectionInstances[1];
      
      var data = byLicenceCollection.clone();
      data.unshift(new this.model({
        id: 'total',
        title: 'Total submissions',
        values: totalCollection.models
      }, { parse: true }));
      
      return data.models;
    }
    
  });
  
  return TotalAndByLicence;
});
