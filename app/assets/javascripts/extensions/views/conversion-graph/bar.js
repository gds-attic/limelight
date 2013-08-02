define([
  'extensions/views/graph/interleavedbar'
],
function (InterleavedBar) {
  var ConversionBar = InterleavedBar.extend({
    interactive: true,
    strokeAlign: 'inner',

    blockWidth: function (group, groupIndex, model, index) {
      var x0 = this.scales.x(this.graph.getXPos(0, 0));
      var x1 = this.scales.x(this.graph.getXPos(0, 1));
      return x1 - x0;
    },
    text: function (model, i) {
      return Math.round(100 * model.get('uniqueEventsNormalised')) + '%';
    }
  });

  return ConversionBar;
});
