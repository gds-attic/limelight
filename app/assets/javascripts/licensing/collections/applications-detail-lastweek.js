define([
  'require',
  'extensions/collections/collection'
],
function (require, Collection) {
  /**
   * Retrieves data for a specific licence, grouped by authority,
   * for all authorities
   */
  var LicenceApplications = Collection.extend({
    
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
      
      var params = {
        start_at: start_of_day.clone().subtract(1, 'weeks'),
        end_at: start_of_day,
        group_by: this.groupBy
      };
      
      return params;
    }
  });

  return LicenceApplications;
});
