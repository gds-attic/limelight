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
        var start_of_day = this.moment().day(1).startOf('day');
        var params = {
        start_at: start_of_day.clone().subtract(1, 'weeks'),
        end_at: start_of_day,
        group_by: this.groupBy,
        collect: ['authorityName', 'licenceName']
      };
      
      return params;
    },
    
    comparators: {
      group: function (attr, descending) {
        return this.defaultComparator(this.groupBy, descending);
      }
    }
    
  });

  return LicenceApplications;
});
