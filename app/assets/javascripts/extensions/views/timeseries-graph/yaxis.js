define([
  'extensions/views/graph/axis'
],
function (Axis) {
  
  var TimeseriesYAxis = Axis.extend({
    position: 'left',
    classed: 'y-axis',
    ticks: 7,
    orient: 'left',
    getScale: function () {
      return this.scales.y;
    },
    tickFormat: function () {
      return this.numberListFormatter(this.scales.y.tickValues);
    }
  });
  
  return TimeseriesYAxis;
});
