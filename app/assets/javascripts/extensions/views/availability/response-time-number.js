define([
  'extensions/views/view'
],
function (View) {
  var ResponeTimeNumberView = View.extend({
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

        content = [
          '<strong>',
          model.get('avgresponse'),
          'ms</strong> ',
          start.format('ha'),
          ' to ',
          end.format('ha'),
          ',<br>',
          start.format('D MMMM YYYY')
        ].join('');
      } else {
        content = [
          '<strong>',
          Math.round(this.collection.getAverageResponseTime()),
          'ms</strong>',
          'mean for the last 24 hours'
        ].join('');
      }
      this.$el.html(content);
    }
  });

  return ResponeTimeNumberView;
});
