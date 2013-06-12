define([
  './axis'
],
function (Axis) {
  
  var XAxis = Axis.extend({
    
    classed: 'x-axis',
    position: 'bottom',
    orient: 'bottom',
    offsetY: 8,
    getScale: function () {
      return this.scales.x;
    },
    onChangeSelected: function (groupSelected, groupIndexSelected, modelSelected, indexSelected) {
      var ticks = this.componentWrapper.selectAll('.tick');
      ticks.classed('selected', false);

      if (indexSelected != null) {
        d3.select(ticks[0][indexSelected]).classed('selected', true);
      }
    }
  });
  
  return XAxis;
});
