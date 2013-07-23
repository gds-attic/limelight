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
    
    serviceName: 'licensing',
    apiName: 'application',
    
    queryId: 'applications-detail-lastweek',

    queryParams: function () {
      var lastWeek = this.lastWeekDateRangeParams(this.moment().utc());
      
      return _.extend(lastWeek, {
        group_by: this.groupBy
      });
    }
  });

  return LicenceApplications;
});
