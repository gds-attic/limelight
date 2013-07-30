define([
  'require',
  'extensions/views/timeseries-graph/timeseries-graph',
  './tooltip'
],
function (require, TimeseriesGraph, Tooltip) {
  var ResponseTimeGraph = TimeseriesGraph.extend({

    valueAttr: 'avgresponse',

    getConfigName: function () {
      return 'hour';
    },

    components: function () {
      return [
        { view: this.sharedComponents.xaxis },
        {
          view: this.sharedComponents.yaxis,
          options: {
            ticks: 3,
            tickFormat: function () {
              return function (d) {
                return d + 'ms';
              };
            }
          }
        },
        {
          view: this.sharedComponents.stack,
          options: { drawCursorLine: true }
        },
        {
          view: Tooltip,
          options: {
            getValue: function (group, groupIndex, model, index) {
              return model.get(this.graph.valueAttr) + 'ms';
            }
          }
        },
        { view: this.sharedComponents.hover }
      ];
    },

    calcXScale: function () {
      var start, end, xScale;
      
      var total = this.collection.first().get('values');
      
      start = moment(total.first().get('_timestamp'));
      end = moment(total.last().get('_timestamp'));
      
      xScale = this.d3.time.scale();
      xScale.domain([start.toDate(), end.toDate()]);
      xScale.range([0, this.innerWidth]);

      return xScale;
    }

  });

  return ResponseTimeGraph;
});
