define([
  'require',
  './applications'
],
function (require, Applications) {
  /**
   * Retrieves data for a specific licence
   */
  var LicenceApplications = Applications.extend({
    
    initialize: function (models, options) {
      this.licenceUrlSlug = options.licenceUrlSlug;
      Applications.prototype.initialize.apply(this, arguments);
    },

    queryParams: function () {
      return _.extend(Applications.prototype.queryParams(), {
        filter_by: 'licenceUrlSlug:' + this.licenceUrlSlug
      });
    }
  });

  return LicenceApplications;
});
