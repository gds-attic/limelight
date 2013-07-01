define([
  'extensions/views/graph/xaxis'
],
function (XAxis) {
  
  var TimeseriesXAxis = XAxis.extend({
    
    configs: {
      week: {
        getTick: function (model) {
          return moment(model.get('_end_at')).subtract(1, 'days').toDate();
        },
        tickFormat: function () {
          var moment = this.moment;
          return function (d, index) {
            return moment(d).format('D MMM');
          }
        }
      },
      month: {
        getTick: function (model, index) {
          return index;
        },
        tickFormat: function () {
          var period = this.collection.query.get('period');
          var values = this.collection.first().get('values');
          return function (d, index) {
            return values.at(index).get('_start_at').format('MMM');
          }
        }
      }
    },
    
    tickValues: function () {
      return this.collection.first().get('values').map(this.getTick);
    },
    tickPadding: 6,
    tickFormat: function () {
      var period = this.collection.query.get('period');
      var values = this.collection.first().get('values');
      var moment = this.moment;
      return function (d, index) {
        if (period === 'month') {
          return values.at(index).get('_start_at').format('MMMM');
        } else {
          return moment(d).format('D MMM');
        }
      }
    }
  });
  
  return TimeseriesXAxis;
});
