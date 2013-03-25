define([
  'extensions/collection'
],
function (Collection) {
  var WeeklyApplications = Collection.extend({

    queryUrl: 'licensing',

    queryParams: function () {
      // add 1 day to correct for sun-sat week
      var end = this.moment().startOf('week').add(1, 'days');
      return {
        start_at: this.moment(end).subtract(9, 'weeks'),
        end_at: end,
        period: 'week'
      }
    },

    parse: function (response) {
      return response.data;
    },

    /**
    * Keep sorted chronologically
    */
    comparator: function(model) {
      return +model.get('_start_at');
    }
  });

  return WeeklyApplications;
});
