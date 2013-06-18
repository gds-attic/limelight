define([
  'extensions/views/view'
],
function (View) {
  var VisitorsRealtimeView = View.extend({
    initialize: function (options) {
      this.collection.on('reset', this.updateValue, this);
      this.collectionUpdateInterval = (options && options.collectionUpdateInterval) || 120 * 1000;
      this.numberOfVisitorsRealtime = 0;
    },
    updateInterval: 5000,
    updateValue: function () {
      if (!this.collection.length) {
        return;
      }

      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }

      var newNumberOfVisitors = parseFloat(this.collection.at(0).get("unique_visitors"));
      if (!this.currentNumberOfVisitors) {
        if (this.collection.length == 1) {
          this.currentNumberOfVisitors = 0;
        } else {
          this.currentNumberOfVisitors = parseFloat(this.collection.at(1).get("unique_visitors"));
        }
      }

      var numberOfSteps = this.collectionUpdateInterval / this.updateInterval;

      var diff = (newNumberOfVisitors - this.currentNumberOfVisitors) / numberOfSteps;

      var that = this;
      var interpolate = function () {
        that.render.call(that);
        that.currentNumberOfVisitors += diff;

        if (numberOfSteps-- > 0) {
          that.timer = setTimeout(interpolate, that.updateInterval);
        }
      };
      interpolate();
    },
    render: function () {
      if (!this.collection.length) {
        return;
      }
      var numberOfVisitors = this.currentNumberOfVisitors || parseFloat(this.collection.at(0).get("unique_visitors"));

      this.$el.html("<strong>" + Math.round(numberOfVisitors) + "</strong> Users online now");
    }
  });
  return VisitorsRealtimeView;
})