define([
  'extensions/collections/graphcollection'
],
function (GraphCollection) {
  var DigitalTakeupCollection = GraphCollection.extend({

    serviceName: 'vehicle-licensing',
    apiName: 'volumetrics',

    queryParams: function () {
      return {
        collect: 'volume:sum',
        period: 'month',
        group_by: 'channel',
        filter_by: 'service:' + this.options.type
      }
    },

    parse: function (response) {
      var data = response.data;

      var sumTotal = 0;
      var channels = {};
      _.each(data, function (series) {
        channels[series.channel] = series;
        sumTotal += series['volume:sum'] || 0
      });

      var getFraction = function (index) {
        var digital = channels['fully-digital'].values[index]['volume:sum'] || null;
        var assisted = channels['assisted-digital'].values[index]['volume:sum'] || null;
        var manual = channels['manual'].values[index]['volume:sum'] || null;
        var fraction = digital / (digital + assisted + manual);
        if (isNaN(fraction)) {
          fraction = null;
        }
        return fraction;
      };

      var values = _.map(channels['fully-digital'].values, function (d, index) {
        return {
          _start_at: d._start_at,
          _end_at: d._end_at,
          fraction: getFraction(index)
        };
      });

      return [{
        id: 'digital',
        title: 'Digital',
        fraction: channels['fully-digital']['volume:sum'] / sumTotal,
        values: values
      }];
    }

  });

  return DigitalTakeupCollection;
});
