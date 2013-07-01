define([
  'extensions/views/view'
],
function (View) {
  var SubmissionsNumberView = View.extend({
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
        var end = moment(model.get('_end_at')).subtract(1, 'days');

        content = [
          '<strong>',
          this.formatNumericLabel(selection.selectedModel.get('uniqueEvents')),
          '</strong> ',
          start.format(start.month() === end.month() ? 'D' : 'D MMM'),
          ' – ',
          end.format('D MMM YYYY')
        ].join('');
      } else {
        var values = this.collection.at(0).get('values');
        var total = values.reduce(function (memo, model) {
          return memo + model.get('uniqueEvents');
        }, 0);
        var count = values.filter(function (model) {
          return model.get('_id');
        }).length;
        content = [
          '<strong>',
          this.formatNumericLabel(total / count),
          '</strong>',
          'mean over the last ',
          count,
          ' weeks'
        ].join('');
      }
      this.$el.html(content);
    }
  });

  return SubmissionsNumberView;
});
