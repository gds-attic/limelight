define([
  'extensions/collections/collection',
  'extensions/models/group'
],
function (Collection, Group) {
  var WeeklyApplications = Collection.extend({

    model: Group,
    
    queryUrl: 'licensing',

    queryId: 'applications-total-weekly',
    
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
      return [{
        id: 'total',
        title: 'Total submissions',
        values: response.data
      }];
    }
  });

  return WeeklyApplications;
});
