define([
  'extensions/collections/collection'
],
  function (Collection) {
    var HelpUsage = Collection.extend({

      serviceName:'lasting-power-of-attorney',
      apiName:'journey',

      queryParams: function () {
        return {
          period: 'week',
          duration: 1,
          ago: 0,
          filter_by: 'eventAction:help',
          group_by: 'eventLabel',
          collect: [
            'uniqueEvents'
          ]
        };
      },

      parse: function (response) {
        return _.map(response.data, function (d) {
          return {
            description: d.eventLabel,
            count: d.uniqueEvents[0]
          }
        });
      }
    });

    return HelpUsage;
  });
