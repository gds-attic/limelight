define([
  'extensions/collections/graphcollection'
],
function (GraphCollection) {
  var DigitalTakeupCollection = GraphCollection.extend({

    serviceName: 'vehicle-licensing',
    apiName: 'volumetrics',

    queryParams: function () {
      return {
        filter_by: 'service:' + this.options.type
      }
    },

    parse: function (response) {
      var itemsByWeek = {},
          sumTotal = 0,
          sumDigital = 0;
      _.each(response.data, function(d) {
        if (!itemsByWeek[d._week_start_at]) {
          itemsByWeek[d._week_start_at] = {
            total: 0,
            digital: 0,
            _start_at: this.moment(d._week_start_at),
            _end_at: this.moment(d._week_start_at).add(1, 'weeks')
          }
        }
        var item = itemsByWeek[d._week_start_at];
        item.total += d.volume;
        sumTotal += d.volume;
        if (d.channel === 'fully-digital') {
          item.digital += d.volume;
          sumDigital += d.volume;
        }
      }, this);

      return [{
        id: 'digital',
        title: 'Digital',
        fraction: sumDigital / sumTotal,
        values: _.map(itemsByWeek, function (d) {
          if (d.total) {
            d.fraction = d.digital / d.total;
          }
          return d;
        })
      }];
    }

  });

  return DigitalTakeupCollection;
});
