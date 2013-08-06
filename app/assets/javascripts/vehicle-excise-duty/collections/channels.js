define([
  'extensions/collections/graphcollection'
],
function (GraphCollection) {
  var Channels = GraphCollection.extend({

    serviceName: 'vehicle-excise-duty',
    apiName: 'channels',

    queryParams: function () {
      return {
        period: 'week'
      };
    },

    parse: function (response) {
      var seriesList = [
        { id: 'successful_agent', title: 'Agent' },
        { id: 'successful_ivr', title: 'IVR' },
        { id: 'successful_web', title: 'Web' }
      ];
      return _.map(seriesList, function (series) {
        return {
          id: series.id,
          title: series.title,
          values: _.map(response.data, function (d) {
            return {
              _start_at: d.values[0]._start_at,
              _end_at: d.values[0]._end_at,
              _count: d[series.id + ':sum']
            };
          })
        };
      });
    }
  });

  return Channels;
});
