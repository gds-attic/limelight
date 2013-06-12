define([
  'extensions/views/graph/bar'
],
function (Bar) {
  var ConversionBar = Bar.extend({
    interactive: true,
    strokeAlign: 'inner',
    x: function (model, i) {
      return this.scales.x(i);
    },
    yStack: function (model) {
      return model.get('uniqueEvents');
    },
    barWidth: function (model, i) {
      return this.scales.x(1) - this.scales.x(0);
    },
    text: function (model, i) {
      return Math.round(100 * model.get('uniqueEvents') / this.scales.y.domain()[1]) + '%';
    }
  });

  return ConversionBar;
});
