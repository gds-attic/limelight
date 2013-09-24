define([
  'extensions/collections/collection'
],
function (Collection) {
  var WeeklyApplications = Collection.extend({

    serviceName: 'licensing',
    apiName: 'application',

    queryId: 'applications-total-weekly',
    
    id: 'total',
    
    title: 'Total forms received',

    parse: function (response) {
      return response.data;
    }
  });

  return WeeklyApplications;
});
