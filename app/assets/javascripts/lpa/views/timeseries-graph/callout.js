define([
  'extensions/views/graph/callout'
],
function (TimeseriesCallout) {
  
  var LPATimeseriesCallout = TimeseriesCallout.extend({

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
