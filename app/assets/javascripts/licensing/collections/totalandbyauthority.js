define([
  'require',
  'extensions/multicollection',
  'extensions/collection',
  './applications',
  './byauthority'
],
function (require, MultiCollection, Collection, Total, ByAuthority) {
  
  var TotalAndByAuthority = MultiCollection.extend({
    
    collections: [Total, ByAuthority],
    
    initialize: function () {
      this.meta = new Collection();
      
      MultiCollection.prototype.initialize.apply(this, arguments);
    },
    
    /**
     * Creates a collection of authority slugs and names.
     */
    parseMeta: function () {
      var byAuthorityCollection = this.collectionInstances[1];
      if (!byAuthorityCollection.length) {
        return;
      }
      
      var values = byAuthorityCollection.at(0).get('authorityUrlSlug');
      
      var meta = _.map(values, function (value, authorityUrlSlug) {
        return {
          id: authorityUrlSlug,
          title: value.authorityName[0]
        }
      });
      meta.unshift({
          id: 'total',
          title: 'Total'
      });
      
      this.meta.reset(meta);
    },
    
    /**
     * Zips up total applications and applications by authority.
     * Calculates authority metadata collection
     */
    parse: function () {
      this.parseMeta();
      
      var totalCollection = this.collectionInstances[0];
      var byAuthorityCollection = this.collectionInstances[1];
      
      var data = [];
      totalCollection.each(function (model, index) {
        var entry = {
          total: model.get('_count'),
          '_start_at': model.get('_start_at'),
          '_end_at': model.get('_end_at')
        };
        _.each(byAuthorityCollection.at(index).get('authorityUrlSlug'), function (values, id) {
          entry[id] = values['_count'];
        });
        data.push(entry);
      });
      
      return data;
    }
    
  });
  
  return TotalAndByAuthority;
});
