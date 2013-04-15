define([
  'require',
  'extensions/collection',
  'licensing/models/applicationstablerow'
],
function (require, Collection, Model) {
  /**
   * Retrieves data for a specific licence, grouped by authority,
   * for all authorities
   */
  var LicenceApplications = Collection.extend({
    
    model: Model,
    
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
    
    queryId: 'applications-detail-lastweek',

    queryParams: function () {
      var start_of_day = this.moment().utc().day(1).startOf('day');
      
      var collect;
      if (this.groupBy === 'authorityUrlSlug') {
        collect = 'authorityName';
      } else if (this.groupBy === 'licenceUrlSlug') {
        collect = 'licenceName';
      }
      var params = {
        start_at: start_of_day.clone().subtract(1, 'weeks'),
        end_at: start_of_day,
        group_by: this.groupBy,
        collect: collect
      };
      
      return params;
    },
    
    comparators: {
      group: function (attr, descending) {
        if (this.groupBy == 'authorityUrlSlug') {
          var comparatorAttr = 'authoritySortName';
        } else {
          var comparatorAttr = this.groupBy;
        }
        return this.defaultComparator(comparatorAttr, descending);
      }
    }
    
  });

  return LicenceApplications;
});
