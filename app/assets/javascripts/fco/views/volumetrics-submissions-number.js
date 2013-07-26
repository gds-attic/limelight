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
          ' to ',
          end.format('D MMM YYYY')
        ].join('');
      } else {
        content = [
          '<strong>',
          this.formatNumericLabel(this.collection.at(0).get('mean')),
          '</strong>',
          'mean per week over the last ',
          this.collection.at(0).get('weeksWithData'),
          ' weeks'
        ].join('');
      }
      this.$el.html(content);
    }
  });

  return SubmissionsNumberView;
});
