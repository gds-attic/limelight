define([
    'extensions/views/view'
],
function (View) {
    var SuccessRateView = View.extend({

      initialize: function () {
        this.collection.on('reset', this.render, this);
        View.prototype.initialize.apply(this, arguments);
      },

      getValue: function () {
        var start = this.collection.where({
          eventCategory: this.startStep
        });
        var end = this.collection.where({
          eventCategory: this.endStep
        });

        var value = null;
        if (start.length && end.length && start[0].get('uniqueEvents') != 0) {
          value = end[0].get('uniqueEvents') / start[0].get('uniqueEvents');
        }

        return value;
      },

      render: function () {
        var value = this.getValue();
        if (value == null) {
          return;
        }

        this.$el.html([
          '<strong>',
          Math.round(value * 100),
          '%</strong>'
        ].join(''));
      }

    });

    return SuccessRateView;
});
