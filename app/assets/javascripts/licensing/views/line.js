define([
  'extensions/views/graph/line'
],
function (Line) {
  
  var ApplicationsLine = Line.extend({
    
    interactive: function (e) {
      return e.slice % 3 !== 2;
    },
    
    x: function (model, index) {
      // display data points on sundays
      var x = this.moment(model.get('_end_at')).subtract(1, 'days');
      return this.scales.x(x.toDate());
    },
    
    y: function (model, index) {
      return this.scales.y(model.get('_count'));
    }
  });
  
  return ApplicationsLine;
});
