define([
  'require',
  'extensions/collection',
  'licensing/models/perlicencetablerow'
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
      // add 1 day to correct for sun-sat week
      var end = this.moment().startOf('week').add(1, 'days');
      var params = {
        start_at: this.moment(end).subtract(1, 'weeks'),
        end_at: end,
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
