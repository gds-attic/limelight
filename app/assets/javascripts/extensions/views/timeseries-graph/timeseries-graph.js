define([
  'require',
  'extensions/views/graph/graph',
  './xaxis',
  './yaxis',
  './line',
  './stack',
  'extensions/views/graph/hover',
  './callout'
],
function (require, Graph, XAxis, YAxis, Line, Stack, Hover, Callout) {
  var TimeseriesGraph = Graph.extend({
    
    sharedComponents: {
      xaxis: XAxis,
      yaxis: YAxis,
      line: Line,
      stack: Stack,
      callout: Callout,
      hover: Hover
    },
    
    components: function () {
      return [
        { view: this.sharedComponents.xaxis },
        { view: this.sharedComponents.yaxis },
        { view: this.sharedComponents.stack },
        { view: this.sharedComponents.callout },
        { view: this.sharedComponents.hover }
      ];
    },

    yAxisInstance: function() {
      return this.componentInstances[1];
    },

    getConfigName: function () {
      return this.collection.query.get('period') || 'week';
    },

    calcXScale: function () {
      var start, end, xScale;
      
      var total = this.collection.first().get('values');
      
      if (this.collection.query.get('period') === 'month') {
        xScale = this.d3.scale.linear();
        xScale.domain([0, total.length - 1]);
      } else {
        // scale from first sunday to last sunday
        start = moment(total.first().get('_end_at')).subtract(1, 'days');
        end = moment(total.last().get('_end_at')).subtract(1, 'days');
        
        xScale = this.d3.time.scale();
        xScale.domain([start.toDate(), end.toDate()]);
      }
      
      xScale.range([0, this.innerWidth]);
      
      return xScale;
    },

    minYDomainExtent: 6,

    YScaleFunction: "calcYSeriesMax",
    
    calcYScale: function () {
      var d3 = this.d3;
      var max = this[this.YScaleFunction](this.valueAttr);
      var yScale = this.d3.scale.linear();
      var minimumTickCount = this.yAxisInstance().ticks;
      var tickValues = this.calculateLinearTicks([0, Math.max(max, this.minYDomainExtent)], minimumTickCount);
      yScale.domain(tickValues.extent);
      yScale.rangeRound([this.innerHeight, 0]);
      yScale.tickValues = tickValues.values;

      return yScale;
    },

    calcYSeriesMax: function (valueAttr) {
      return d3.max(this.collection.models, function (group) {
        return d3.max(group.get('values').models, function (value) {
          return value.get(valueAttr);
        });
      });
    },

    calcYSeriesSum: function (valueAttr) {
      var sums = [];
      for (var i = 0; i < this.collection.at(0).get('values').length; i++) {
        sums.push(this.collection.reduce(function (memo, group) {
          return memo + group.get('values').at(i).get(valueAttr);
        }, 0));
      }
      return d3.max(sums);
    }
  });
  
  return TimeseriesGraph;
});
