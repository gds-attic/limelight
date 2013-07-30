define([
  'extensions/views/view'
],
function (View) {
  var UptimeNumberView = View.extend({
    initialize: function (attrs, options) {
      View.prototype.initialize.apply(this, arguments);
      this.collection.on('change:selected reset', this.render, this);
    },

    render: function () {
      View.prototype.render.apply(this, arguments);
      var selection = this.collection.getCurrentSelection();
      var content;
      if (selection.selectedModel) {
        var model = selection.selectedModel;
        var start = model.get('_start_at');
        var end = model.get('_end_at');

        var percentage = model.get('uptimeFraction') * 100;
        if (percentage !== 100) {
          percentage = percentage.toFixed(1);
        }
        content = [
          '<strong>',
          percentage + '%',
          '</strong> ',
          start.format('ha'),
          ' to ',
          end.format('ha'),
          ',<br>',
          start.format('D MMMM YYYY')

        ].join('');
      } else {
        var percentage = this.collection.getPercentageOfUptime();
        if (percentage !== 100) {
          percentage = percentage.toFixed(1);
        }
        content = [
          '<strong>',
          percentage + '%',
          '</strong>',
          'for the last 24 hours'
        ].join('');
      }
      this.$el.html(content);
    }
  });

  return UptimeNumberView;
});
