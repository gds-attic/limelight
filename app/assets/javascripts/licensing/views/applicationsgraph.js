define([
  'extensions/graph/graph',
  'extensions/graph/axis',
  'extensions/graph/line'
],
function (Graph, Axis, Line) {
  var ApplicationsGraph = Graph.extend({
    
    width: 954,
    height: 400,
    
    margin: {
      top: 20,
      bottom: 50,
      left: 60,
      right: 40
    },
    
    components: function () {
      return [
        {
          view: Axis,
          options: {
            classed: 'x-axis',
            position: 'bottom',
            orient: 'bottom',
            tickValues: function () {
              // a tick every sunday
              var total = this.collection.first().get('values');
              return total.map(function (model) {
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
              return this.numberListFormatter([this.scales.y.domain()[1]]);
            }
          }
        },
        {
          view: Line,
          options: {
            classed: function (group, index) {
              return 'line line' + index + ' ' + group.get('id');
            },
            x: function (group, collection, point) {
              // display data points on sundays
              var x = this.moment(point.get('_end_at')).subtract(1, 'days');
              return this.scales.x(x.toDate());
            },
            y: function (group, collection, point) {
              return this.scales.y(point.get('_count'));
            }
          }
        }
      ]
    },
    
    calcXScale: function () {
      // scale from first sunday to last sunday
      var total = this.collection.first().get('values');
      var start = moment(total.first().get('_end_at')).subtract(1, 'days');
      var end = moment(total.last().get('_end_at')).subtract(1, 'days');
      var xScale = this.d3.time.scale();
      xScale.domain([start.toDate(), end.toDate()]);
      xScale.range([0, this.innerWidth]);
      return xScale;
    },
    
    calcYScale: function () {
      var collection = this.collection;
      var d3 = this.d3;
      var max = d3.max(this.collection.models, function (group) {
        return d3.max(group.get('values').models, function (value) {
          return value.get('_count');
        });
      });
      
      var yScale = this.d3.scale.linear();
      var tickValues = this.calculateLinearTicks([0, max], 7);
      yScale.domain(tickValues.extent);
      yScale.rangeRound([this.innerHeight, 0]);
      yScale.tickValues = tickValues.values;
      return yScale;
    }
  });
  
  return ApplicationsGraph;
});
