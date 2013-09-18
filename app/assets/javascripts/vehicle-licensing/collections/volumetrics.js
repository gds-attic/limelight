define([
  'extensions/collections/graphcollection'
],
function (GraphCollection) {
  var VolumetricsCollection = GraphCollection.extend({

    serviceName: 'vehicle-licensing',
    apiName: 'volumetrics',

    queryParams: function () {
      return {
        collect: 'volume:sum',
        period: 'month',
        group_by: 'channel',
        filter_by: this.options.type ? ['service:' + this.options.type] : []
      }
    },

    seriesList: [
      { id: 'manual', title: 'Manual' },
      { id: 'assisted-digital', title: 'Post Office' },
      { id: 'fully-digital', title: 'Digital' }
    ],

    parse: function (response) {
      var data = response.data;

      return _.map(this.seriesList, function (series) {
        var dataSeries = _.find(data, function (d) {
          return d.channel === series.id;
        });

        return _.extend({}, series, {
          values: dataSeries.values
        });
      });
    }

  });

  return VolumetricsCollection;
});
