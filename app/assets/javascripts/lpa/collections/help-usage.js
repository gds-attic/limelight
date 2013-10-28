define([
  'extensions/collections/collection'
],
  function (Collection) {
    var HelpUsage = Collection.extend({

      serviceName:'lasting-power-of-attorney',
      apiName:'journey',

      queryParams: function () {
        return _.extend(this.lastWeekDateRangeParams(this.moment()), {
          filter_by: 'eventAction:help.inline',
          group_by: 'eventDestination',
          collect: [
            'uniqueEvents'
          ]
        });
      },

      parse: function (response) {
        return _.map(response.data, function (d) {
          return {
            description: d.eventDestination,
            count: d.uniqueEvents[0]
          }
        });
      }
    });

    return HelpUsage;
  });
