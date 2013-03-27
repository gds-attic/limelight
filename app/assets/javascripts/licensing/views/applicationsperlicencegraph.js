define([
  'require',
  './applicationsgraph',
  './linelabel',
],
function (require, ApplicationsGraph, LineLabel) {
  var ApplicationsPerLicenceGraph = ApplicationsGraph.extend({
    
    margin: {
      top: 20,
      bottom: 50,
      left: 60,
      right: 200
    },
    
    components: function () {
      var components = ApplicationsGraph.prototype.components.apply(this, arguments);
      // overwrite options for line component
      _.last(components).options = {
        classed: function (metaModel, index) {
          return 'line line' + index + ' ' + metaModel.get('id');
        },

        x: function (metaModel, model, index) {
          // display data points on sundays
          var x = this.moment(model.get('_end_at')).subtract(1, 'days');
          return this.scales.x(x.toDate());
        },
        y: function (metaModel, model, index) {
          return this.scales.y(model.get(metaModel.get('id')) || 0);
        }
      };
      components.push({
        view: LineLabel
      });
      return components;
    },
    
    calcYScale: function () {
      var collection = this.collection;
      var yScale = this.d3.scale.linear();
      var max = this.d3.max(collection.models, function (model) {
        return model.get('total');
      });
      var tickValues = this.calculateLinearTicks([0, max], 7);
      yScale.domain(tickValues.extent);
      yScale.rangeRound([this.innerHeight, 0]);
      yScale.tickValues = tickValues.values;

      return yScale;
    }
    
  });
  
  return ApplicationsPerLicenceGraph;
});
