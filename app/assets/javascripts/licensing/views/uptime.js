define([
  'extensions/views/view'
],
function (View) {
  var UptimeView = View.extend({

    initialize: function () {
      View.prototype.initialize.apply(this, arguments);
      this.collection.on('reset', this.render, this);
    },
    render: function () {
      this.$el.html("<strong>" + this.collection.getPercentageOfUptime() + "%</strong>");
    }
  });
  return UptimeView;
});
