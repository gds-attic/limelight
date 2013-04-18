define([
  'require',
  'extensions/collection',
  '../models/entity'
],
function (require, Collection, Entity) {
  var AllEntities = Collection.extend({
    
    model: Entity,
    
    initialize: function (models, options) {
      if (!options.groupBy) {
        throw "groupBy option is mandatory";
      }
      this.groupBy = options.groupBy;
      Collection.prototype.initialize.apply(this, arguments);
    },
    
    parse: function (response) {
      return response.data;
    },
    
    queryUrl: 'licensing',
    
    queryId: 'all-entities',

    queryParams: function () {
      var collect;
      if (this.groupBy === 'authorityUrlSlug') {
        collect = 'authorityName';
      } else if (this.groupBy === 'licenceUrlSlug') {
        collect = 'licenceName';
      }
      var params = {
        group_by: this.groupBy,
        collect: collect
      };
      
      return params;
    }
  });

  return AllEntities;
});
