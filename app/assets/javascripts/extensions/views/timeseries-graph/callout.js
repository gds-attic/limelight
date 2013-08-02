define([
  'extensions/views/graph/callout'
],
function (Callout) {
  
  var TimeseriesCallout = Callout.extend({
  
    horizontal: 'right',
    vertical: 'bottom',
    xOffset: -7,
    yOffset: -7,
    
    configs: {
      week: {
        getHeader: function (el, group, groupIndex, model, index) {
          var start = model.get('_start_at');
          var end = moment(model.get('_end_at')).subtract(1, 'days');

          return [
            start.format(start.month() === end.month() ? 'D' : 'D MMM'),
            ' to ',
            end.format('D MMM YYYY')
          ].join('');
        }
      },
      month: {
        getHeader: function (el, group, groupIndex, model, index) {
          var start = model.get('_start_at');
          return start.format('MMMM YYYY');
        }
      }
    },

    renderContent: function (el, group, groupIndex, model, index) {
      
      var header = $('<h3>').html(this.getHeader.apply(this, arguments));
      
      var body = $('<dl>').html([
        '<dt>',
        group.get('title'),
        '</dt>',
        '<dd>',
        this.formatNumericLabel(Math.floor(model.get(this.graph.valueAttr))),
        '</dd>'
      ].join(''));
      
      el.empty().append(header, body);
    }
    
  });
  
  return TimeseriesCallout;
});
