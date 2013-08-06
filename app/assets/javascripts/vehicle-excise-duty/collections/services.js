define([
  'extensions/collections/graphcollection'
],
function (GraphCollection) {
  var Services = GraphCollection.extend({

    serviceName: 'vehicle-excise-duty',
    apiName: 'services',

    queryParams: function () {
      return {
        period: 'week'
      };
    },

    parse: function (response) {
      var seriesList = [
        { id: 'successful_sorn', title: 'SORN' },
        { id: 'successful_tax_disc', title: 'Tax-disc' }
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

  return Services;
});
