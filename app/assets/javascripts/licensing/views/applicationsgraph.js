define([
  'require',
  'extensions/views/graph/graph',
  './xaxis',
  './yaxis',
  './stack'
],
function (require, Graph, XAxis, YAxis, Stack) {
  var ApplicationsGraph = Graph.extend({
    
    width: 954,
    height: 400,
    
    margin: {
      top: 20,
      bottom: 40,
      left: 45,
      right: 40
    },
    
    axisComponents: function () {
      return [
        { view: XAxis },
        { view: YAxis }
      ];
    },
    
    components: function () {
      return this.axisComponents().concat([
        { view: Stack }
      ]);
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
      var tickValues = this.calculateLinearTicks([0, Math.max(max, 6)], 7);
      yScale.domain(tickValues.extent);
      yScale.rangeRound([this.innerHeight, 0]);
      yScale.tickValues = tickValues.values;
      return yScale;
    }
  });
  
  return ApplicationsGraph;
});
