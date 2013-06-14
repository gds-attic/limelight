define([
  'extensions/views/graph/interleavedbar'
],
function (InterleavedBar) {
  var ConversionBar = InterleavedBar.extend({
    interactive: true,
    strokeAlign: 'inner',

    yStack: function (model) {
      return model.get('uniqueEventsNormalised');
    },
    blockWidth: function (model, i) {
      return this.scales.x(1) - this.scales.x(0);
    },
    text: function (model, i) {
      return Math.round(100 * model.get('uniqueEventsNormalised')) + '%';
    }
  });

  return ConversionBar;
});
