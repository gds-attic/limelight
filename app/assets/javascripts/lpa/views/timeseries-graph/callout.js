define([
  'extensions/views/timeseries-graph/callout'
],
function (TimeseriesCallout) {
  
  var LPATimeseriesCallout = TimeseriesCallout.extend({

    y: function (model, index) {
      return this.scales.y(model.y0 + model.y);
    },
    
    renderContent: function (el, group, groupIndex, model, index) {
      
      var header = $('<h3>').html(this.getHeader.apply(this, arguments));

      var detail = $('<dl>').html([
        '<dt>',
        group.get('title'),
        '</dt>',
        '<dd>',
        this.formatNumericLabel(Math.floor(model.get(this.graph.valueAttr))),
        ' (',
        Math.round(model.get('fraction') * 100),
        '%)',
        '</dd>'
      ].join(''));

      el.empty().append(header, detail);
    }
    
  });
  
  return LPATimeseriesCallout;
});
