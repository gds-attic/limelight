define([
  'extensions/views/graph/callout'
],
function (Callout) {
  
  var ConversionCallout = Callout.extend({
  
    horizontal: 'centre',
    vertical: 'bottom',
    xOffset: 0,
    yOffset: 0,
    constrainToBounds: false,

    x: function (model, index) {
      return this.scales.x(index);
    },
    
    y: function (model, index) {
      return 0;
    },
    
    getPivotingElement: function () {
      return this.calloutEl.find('.arrow');
    },

    renderContent: function (el, group, groupIndex, model, index) {

      var arrow = $('<div>').addClass('arrow').html('<span class="outer-arrow">&#x25B2;</span><span class="inner-arrow">&#x25B2;</span>');

      var query = model.collection.query;
      var start = query.get('start_at');
      var end = moment(query.get('end_at')).subtract(1, 'days');

      var header = $('<h3>').html([
        '<span class="date">',
        start.format(start.month() === end.month() ? 'D' : 'D MMM'),
        ' – ',
        end.format('D MMM YYYY'),
        '</span> ',
        model.get('title')
      ].join(''));

      var body = $('<dl>').html([
        '<dt>Unique visitors to stage:</dt>',
        '<dd>',
        this.formatNumericLabel(model.get('uniqueEvents')),
        '</dd>'
      ].join(''));
      
      el.empty().append(arrow, header, body);
    }
    

  });
  
  return ConversionCallout;
});
