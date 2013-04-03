define([
  'require',
  'extensions/multicollection',
  './applications-total-weekly',
  './applications-top5licences-weekly'
],
function (require, MultiCollection, Total, ByLicence) {
  
  var TotalAndByLicence = MultiCollection.extend({
    
    collections: [Total, ByLicence],
    
    /**
     * Combines total applications and applications by authority.
     */
    parse: function () {
      var totalCollection = this.collectionInstances[0];
      var byLicenceCollection = this.collectionInstances[1];
      
      var data = byLicenceCollection.clone();
      data.unshift(totalCollection.first());
      
      return data.models;
    }
    
  });
  
  return TotalAndByLicence;
});
