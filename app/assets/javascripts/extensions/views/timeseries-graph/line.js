define([
  'extensions/views/graph/line'
],
function (Line) {
  
  var TimeseriesLine = Line.extend({
    
    interactive: function (e) {
      return e.slice % 3 !== 2;
    },
    
    configs: {
      week: {
        x: function (model, index) {
          // display data points on sundays
          var x = this.moment(model.get('_end_at')).subtract(1, 'days');
          return this.scales.x(x.toDate());
        }
      },
      month: {
        x: function (model, index) {
          return this.scales.x(index);
        }
      }
    },
    
    y: function (model, index) {
      return this.scales.y(model.get(this.graph.valueAttr));
    }
  });
  
  return TimeseriesLine;
});
