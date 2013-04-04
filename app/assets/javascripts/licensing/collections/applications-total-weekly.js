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
      var query = {
        start_at: this.moment().day(1).subtract(9, 'weeks'),
        end_at: this.moment().day(1),
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
