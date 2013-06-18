define([
  'extensions/collections/collection'
],
function (Collection) {
  var VisitorsRealtimeCollection = Collection.extend({
    serviceName: "licensing",
    apiName: "realtime",
    parse: function (response) {
      return response.data;
    },
    queryParams: {
      sort_by: "_timestamp:descending",
      limit: 2
    }
  });
  return VisitorsRealtimeCollection;
});