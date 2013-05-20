define([
  'extensions/views/graph/callout'
],
function (Callout) {
  
  var ApplicationsCallout = Callout.extend({
  
    horizontal: 'right',
    vertical: 'bottom',
    xOffset: -7,
    yOffset: -7,
    
    y: function (model, index) {
      return this.scales.y(model.get('_count'));
    },
    
    configs: {
      week: {
        x: function (model, index) {
          // display data points on sundays
          var x = this.moment(model.get('_end_at')).subtract(1, 'days');
          return this.scales.x(x.toDate());
        },
        getHeader: function (el, group, groupIndex, model, index) {
          var start = model.get('_start_at');
          var end = moment(model.get('_end_at')).subtract(1, 'days');

          return [
            start.format(start.month() === end.month() ? 'D' : 'D MMM'),
            ' – ',
            end.format('D MMM')
          ].join('');
        }
      },
      month: {
        x: function (model, index) {
          return this.scales.x(index);
        },
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
        this.formatNumericLabel(Math.floor(model.get('_count'))),
        '</dd>'
      ].join(''));
      
      el.empty().append(header, body);
    }
    
  });
  
  return ApplicationsCallout;
});
