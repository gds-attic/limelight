define([
  'extensions/graph/graph',
  'extensions/graph/axis',
  'extensions/graph/line'
],
function (Graph, Axis, Line) {
  var TotalApplications = Graph.extend({
    
    width: 954,
    height: 400,
    
    margin: {
      top: 20,
      bottom: 50,
      left: 60,
      right: 40
    },
    
    components: [
      {
        view: Axis,
        options: {
          classed: 'x-axis',
          position: 'bottom',
          orient: 'bottom',
          tickPadding: 4,
          tickFormat: function () {
            return d3.time.format("%e %b");
          },
          offsetY: 20,
          getScale: function () {
            return this.scales.x;
          }
        }
      },
      {
        view: Axis,
        options: {
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
        }
      },
      {
        view: Line,
        options: {
          classed: 'line',
          x: function (model) {
            return this.scales.x(model.get('_start_at').toDate());
          },
          y: function (model) {
            return this.scales.y(model.get('_count'));
          }
        }
      }
    ],
    
    calcXScale: function () {
      var collection = this.collection;
      var xScale = this.d3.time.scale();
      xScale.domain([
        collection.first().get('_start_at').toDate(),
        collection.last().get('_start_at').toDate()
      ]);
      xScale.range([0, this.innerWidth]);
      return xScale;
    },
    
    calcYScale: function () {
      var collection = this.collection;
      var yScale = this.d3.scale.linear();
      var max = this.d3.max(collection.models, function (model) {
        return model.get('_count');
      })
      yScale.domain([0, max]).nice();
      yScale.range([this.innerHeight, 0]);
      return yScale;
    }
  });
  
  return TotalApplications;
});
