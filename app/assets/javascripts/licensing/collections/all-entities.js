define([
  'require',
  'extensions/collections/collection',
  '../models/authority',
  '../models/licence'
],
function (require, Collection, Authority, Licence) {
  var AllEntities = Collection.extend({
    
    initialize: function (models, options) {
      options = options || {};
      if (!options.groupBy) {
        throw "groupBy option is mandatory";
      }
      this.groupBy = options.groupBy;
      if (this.groupBy === 'authorityUrlSlug') {
        this.collect = 'authorityName';
        this.model = Authority;
      } else if (this.groupBy === 'licenceUrlSlug') {
        this.collect = 'licenceName';
        this.model = Licence;
      }
      
      Collection.prototype.initialize.apply(this, arguments);
    },
    
    parse: function (response) {
      return response.data;
    },
    
    queryUrl: 'licensing',
    
    queryId: 'all-entities',

    queryParams: function () {
      var params = {
        group_by: this.groupBy,
        collect: this.collect
      };
      
      return params;
    }
  });

  return AllEntities;
});
