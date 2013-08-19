define([
  'extensions/collections/collection'
],
function (Collection) {
  var FailuresWeek = Collection.extend({

    serviceName: 'vehicle-licensing',
    apiName: 'failures',

    queryParams: function () {
      var params = {
        period: 'week',
        duration: 1,
        ago: this.options.ago || 0,
        group_by: 'reason',
        collect: [
          'count:sum',
          'description'
        ]
      };
      if (this.options.type) {
        _.extend(params, {
          filter_by: 'type:' + this.options.type
        });
      }
      return params;
    },

    parse: function (response) {
      return _.map(response.data, function (d) {
        return {
          count: d['count:sum'],
          reason: d.reason,
          description: d.description[0]
        }
      });
    }
  });

  return FailuresWeek;
});
