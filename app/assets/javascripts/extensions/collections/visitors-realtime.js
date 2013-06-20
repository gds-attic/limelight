define([
  'extensions/collections/collection'
],
function (Collection) {
  var VisitorsRealtimeCollection = Collection.extend({
    initialize: function (models, options) {
      Collection.prototype.initialize.apply(this, arguments);

      this.serviceName = options.serviceName;
    },
    apiName: "realtime",
    parse: function (response) {
      return response.data;
    },
    queryParams: {
      sort_by: "_timestamp:descending",
      limit: 2
    },
    fetch: function (options) {
      options = _.extend({
        cache: false
      }, options);
      Collection.prototype.fetch.call(this, options);
    }
  });
  return VisitorsRealtimeCollection;
});