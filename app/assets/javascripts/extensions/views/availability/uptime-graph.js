define([
  'require',
  'extensions/views/graph/graph',
  './tooltip'
],
function (require, Graph, Tooltip) {
  var UptimeGraph = Graph.extend({

    getConfigNames: function () {
      return ['stack', 'hour'];
    },

    minYDomainExtent: 1,
    numYTicks: 3,

    // use custom properties for stack calculation because
    // ResponseTimeGraph and UptimeGraph are sharing the same
    // Collection
    stackYProperty: 'yUptime',
    stackY0Property: 'yUptime0',
    outStack: function (model, y0, y) {
      model.yUptime0 = y0;
      model.yUptime = y;
    },

    components: function () {
      return [
        { view: this.sharedComponents.xaxis },
        {
          view: this.sharedComponents.yaxis,
          options: {
            tickFormat: function () {
              return function (d) {
                return Math.round(100 * d) + '%';
              };
            }
          }
        },
        {
          view: this.sharedComponents.stack,
          options: {
            drawCursorLine: true
          }
        },
        {
          view: Tooltip,
          options: {
            getValue: function (group, groupIndex, model, index) {
              var value = model.get(this.graph.valueAttr) * 100;
              if (value !== 100) {
                value = value.toFixed(1);
              }
              return value + '%';
            }
          }
        },
        { view: this.sharedComponents.hover }
      ];
    },

    valueAttr: 'uptimeFraction'

  });

  return UptimeGraph;
});
