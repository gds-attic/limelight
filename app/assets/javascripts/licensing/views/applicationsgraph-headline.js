define([
  'extensions/views/view'
],
function (View) {
  var HeadlineView = View.extend({
    initialize: function () {
      View.prototype.initialize.apply(this, arguments);
      this.model.on('change', this.render, this);
    },
    
    postfix: '',
    
    render: function () {
      var period = this.model.get('period');
      this.$el.html([
        'Total form submissions per',
        period,
        'over the last',
        this.model.periods[this.model.get('period')].duration,
        period + 's',
        this.postfix
      ].join(' '));
    }
  });
  
  return HeadlineView;
});
