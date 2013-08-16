define([
  'extensions/collections/graphcollection'
],
function (GraphCollection) {
  var Services = GraphCollection.extend({

    serviceName: 'vehicle-licensing',
    apiName: 'services',

    seriesList: [
      { id: 'successful_sorn', title: 'SORN' },
      { id: 'successful_tax_disc', title: 'Tax-disc' }
    ],

    queryParams: function () {
      return {
        period: 'week',
        collect: _.map(this.seriesList, function (s) {
          return s.id + ':sum';
        })
      };
    },

    parse: function (response) {
      return _.map(this.seriesList, function (series) {
        return {
          id: series.id,
          title: series.title,
          values: _.map(response.data, function (d) {
            return {
              _start_at: d._start_at,
              _end_at: d._end_at,
              _count: d[series.id + ':sum'] || 0
            };
          })
        };
      });
    }
  });

  return Services;
});
