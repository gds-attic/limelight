define([
  'extensions/collection',
  'extensions/group',
],
function (Collection, Group) {
  var WeeklyApplications = Collection.extend({

    model: Group,
    
    queryUrl: 'licensing',

    queryId: 'applications-total-weekly',
    
    queryParams: function () {
      var at_midnight = this.moment().day(1).hour(0).minute(0).second(0).milliseconds(0);
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
        title: 'Total applications',
        values: response.data
      }];
    }
  });

  return WeeklyApplications;
});
