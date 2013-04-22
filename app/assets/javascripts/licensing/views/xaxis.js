define([
  'extensions/views/graph/axis'
],
function (Axis) {
  
  var ApplicationsXAxis = Axis.extend({
    
    classed: 'x-axis',
    position: 'bottom',
    orient: 'bottom',
    tickValues: function () {
      // a tick every sunday
      var total = this.collection.first().get('values');
      return total.map(function (model) {
        return moment(model.get('_end_at')).subtract(1, 'days').toDate();
      });
    },
    tickPadding: 6,
    tickFormat: function () {
      return d3.time.format("%e %b");
    },
    offsetY: 8,
    getScale: function () {
      return this.scales.x;
    }
  });
  
  return ApplicationsXAxis;
});
