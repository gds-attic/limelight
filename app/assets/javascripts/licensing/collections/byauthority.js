define([
  'require',
  './applications',
  'extensions/collection'
],
function (require, Applications, Collection) {
  /**
   * Retrieves data for a specific licence, grouped by authority,
   * for the "top 5" authorities
   */
  var LicenceApplications = Applications.extend({
    
    initialize: function (models, options) {
      this.licenceUrlSlug = options.licenceUrlSlug;
      Applications.prototype.initialize.apply(this, arguments);
    },

    queryParams: function () {
      return _.extend(Applications.prototype.queryParams(), {
        filter_by: this.licenceUrlSlug,
        group_by: 'authorityUrlSlug',
        limit: 5,
        sort_by: '_count'
      });
    }
  });

  return LicenceApplications;
});
