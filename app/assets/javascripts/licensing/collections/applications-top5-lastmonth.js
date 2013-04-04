define([
  'require',
  'extensions/collection',
  'licensing/models/applicationstablerow'
],
function (require, Collection, Model) {
  var Top5Collection = Collection.extend({
    
    model: Model,
    
    initialize: function (models, options) {
      options = options || {};
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
    
    queryId: 'applications-top5-lastmonth',

    queryParams: function () {
      var end = this.moment().startOf('month');
      var params = {
        start_at: this.moment(end).subtract(1, 'months'),
        end_at: end,
        limit: 5,
        group_by: this.groupBy
      };
      
      if (this.groupBy === 'authorityUrlSlug') {
        params.collect = 'authorityName';
      } else if (this.groupBy === 'licenceUrlSlug') {
        params.collect = 'licenceName';
      }
      
      return params;
    }
    
  });

  return Top5Collection;
});
