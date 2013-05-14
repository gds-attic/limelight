define([
  'extensions/views/graph/callout'
],
function (Callout) {
  
  var ApplicationsCallout = Callout.extend({
  
    x: function (model, index) {
      return this.scales.x(
        moment(model.get('_end_at')).subtract(1, 'days').toDate()
      );
    },
    y: function (model, index) {
      return this.scales.y(model.get('_count'));
    },
    renderContent: function (el, group, groupIndex, model, index) {
      var start = model.get('_start_at');
      var end = moment(model.get('_end_at')).subtract(1, 'days');
      
      var header = $('<h3>').html([
        start.format(start.month() === end.month() ? 'D' : 'D MMM'),
        ' – ',
        end.format('D MMM')
      ].join(''));
      
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
