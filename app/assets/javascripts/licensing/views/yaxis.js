define([
  'extensions/graph/axis'
],
function (Axis) {
  
  var ApplicationsYAxis = Axis.extend({
    position: 'left',
    classed: 'y-axis',
    ticks: 7,
    orient: 'left',
    getScale: function () {
      return this.scales.y;
    },
    tickFormat: function () {
      return this.numberListFormatter([this.scales.y.domain()[1]]);
    }
  });
  
  return ApplicationsYAxis;
});
