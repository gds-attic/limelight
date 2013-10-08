define([
  'extensions/collections/graphcollection'
],
function (GraphCollection) {
  var ServicesCollection = GraphCollection.extend({

    serviceName: 'vehicle-licensing',
    apiName: 'volumetrics',

    queryParams: function () {
      return {
        collect: 'volume:sum',
        period: 'month',
        group_by: 'service',
        filter_by: this.options.type ? ['channel:' + this.options.type] : []
      }
    },

    seriesList: [
      {
        id: 'sorn',
        title: 'SORN',
        href: '/performance/sorn'
      },
      {
        id: 'tax-disc',
        title: 'Tax disc',
        href: '/performance/tax-disc'
      }
    ],

    parse: function (response) {
      var data = response.data;

      return _.map(this.seriesList, function (series) {
        var dataSeries = _.find(data, function (d) {
          return d.service === series.id;
        });

        return _.extend({}, series, {
          values: dataSeries.values
        });
      });
    }

  });

  return ServicesCollection;
});
