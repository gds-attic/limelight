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
      if (this.groupBy === 'authorityUrlSlug') {
        this.collect = 'authorityName';
        this.urlFragment = 'authorities';
      } else if (this.groupBy === 'licenceUrlSlug') {
        this.collect = 'licenceName';
        this.urlFragment = 'licences';
      }
      
      
      Collection.prototype.initialize.apply(this, arguments);
    },
    
    parse: function (response) {
      
      return _.map(response.data, function (row) {
        row.slug = row[this.groupBy];
        delete row[this.groupBy];
        
        row.url = '/performance/licensing/' + this.urlFragment + '/' + row.slug;
        
        if (row[this.collect]) {
          row.name = row[this.collect][0];
          delete row[this.collect];
        } else {
          row.name = row.slug;
        }
        return row;
      }, this);
    },
    
    queryUrl: 'licensing',
    
    queryId: 'applications-top5-lastweek',

    queryParams: function () {
      var end = this.moment().day(1).startOf('day');
      var params = {
        start_at: this.moment(end).subtract(1, 'weeks'),
        end_at: end,
        limit: 5,
        group_by: this.groupBy,
        sort_by: '_count:descending',
        collect: this.collect
      };
      
      return params;
    }
    
  });

  return Top5Collection;
});
