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
          tickValues: function () {
            // a tick every sunday
            return this.collection.map(function (model) {
              return moment(model.get('_end_at')).subtract(1, 'days').toDate();
            });
          },
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
            return this.numberListFormatter(this.scales.y.tickValues);
          }
        }
      },
      {
        view: Line,
        options: {
          classed: 'line',
          x: function (model) {
            // display data points on sundays
            var x = model.get('_end_at').subtract(1, 'days');
            return this.scales.x(x.toDate());
          },
          y: function (model) {
            return this.scales.y(model.get('_count'));
          }
        }
      }
    ],
    
    calcXScale: function () {
      // scale from first sunday to last sunday
      var collection = this.collection;
      var start = moment(collection.first().get('_end_at')).subtract(1, 'days');
      var end = moment(collection.last().get('_end_at')).subtract(1, 'days');
      var xScale = this.d3.time.scale();
      xScale.domain([start.toDate(), end.toDate()]);
      xScale.range([0, this.innerWidth]);
      return xScale;
    },
    
    calcYScale: function () {
      var collection = this.collection;
      var yScale = this.d3.scale.linear();
      var max = this.d3.max(collection.models, function (model) {
        return model.get('_count');
      });
      var tickValues = this.calculateLinearTicks([0, max], 7);
      yScale.domain(tickValues.extent);
      yScale.rangeRound([this.innerHeight, 0]);
      yScale.tickValues = tickValues.values;

      return yScale;
    }
  });
  
  return TotalApplications;
});
