define([
  'extensions/collections/collection'
],
function (Collection) {
  var WeeklyApplications = Collection.extend({

    serviceName: 'licensing',
    apiName: 'application',

    queryId: 'applications-total-weekly',
    
    id: 'total',
    
    title: 'Total submissions',
    
    queryParams: function () {
      var at_midnight = this.moment().utc().day(1).startOf('day');
      var query = {
        start_at: at_midnight.clone().subtract(9, 'weeks'),
        end_at: at_midnight,
        period: 'week'
      };

      return query;
    },

    parse: function (response) {
      return response.data;
    }
  });

  return WeeklyApplications;
});
