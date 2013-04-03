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
      // add 1 day to correct for sun-sat week
      var end = this.moment().startOf('week').add(1, 'days');
      
      var query = {
        start_at: this.moment(end).subtract(9, 'weeks'),
        end_at: end,
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
