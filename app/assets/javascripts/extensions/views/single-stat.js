define([
  'extensions/views/view'
],
function (View) {
  var SingleStatView = View.extend({

    initialize: function () {
      View.prototype.initialize.apply(this, arguments);
      this.collection.on('reset', this.render, this);
    },
    render: function () {
      this.$el.html("<strong>" + this.getStatFunction(this.collection) + "</strong>");
    }
  });
  return SingleStatView;
});
