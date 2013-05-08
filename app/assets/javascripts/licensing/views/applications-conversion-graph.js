define([
  'require',
  'extensions/views/graph/graph',
  './xaxis',
  'extensions/views/graph/bar'
],
function (require, Graph, XAxis, Bar) {
  var ConversionGraph = Graph.extend({
    
    width: 954,
    height: 200,
    
    margin: {
      top: 40,
      bottom: 40,
      left: 0,
      right: 0
    },
    
    components: function () {
      return [
        {
          view: XAxis,
          options: {
            tickValues: function () {
              return _.range(this.collection.at(0).get('values').length);
            },
            tickSize: 0,
            tickPadding: 0,
            tickFormat: function () {
              var steps = this.collection.at(0).get('values');
              return function (index) {
                return steps.at(index).get('title');
              };
            }
          }
        },
        {
          view: Bar,
          options: {
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
          }
        }
      ];
    },
    
    calcXScale: function () {
      var xScale = this.d3.scale.linear();
      var count = this.collection.at(0).get('values').length;
      var halfBarWidth = this.innerWidth / count / 2;
      xScale.domain([0, count - 1]);
      xScale.range([halfBarWidth, this.innerWidth - halfBarWidth]);
      return xScale;
    },
    
    calcYScale: function () {
      var collection = this.collection;
      var d3 = this.d3;
      var max = d3.max(this.collection.models, function (group) {
        return d3.max(group.get('values').models, function (value) {
          return value.get('uniqueEvents');
        });
      });
      
      var yScale = this.d3.scale.linear();
      yScale.domain([0, max]);
      yScale.range([this.innerHeight, 0]);
      return yScale;
    }
  });
  
  return ConversionGraph;
});
