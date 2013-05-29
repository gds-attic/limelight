define([
    'extensions/views/view'
],
function (View) {
    var SuccessRateView = View.extend({

      initialize: function () {
        this.collection.on('reset', this.render, this);
      },

      getValue: function () {
        var start = this.collection.where({
          eventCategory: 'licensingUserJourney:downloadFormPage'
        });
        var end = this.collection.where({
          eventCategory: 'licensingUserJourney:end'
        });

        var value = null;
        if (start.length && end.length) {
          value = end[0].get('uniqueEvents') / start[0].get('uniqueEvents') || null;
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
          '%</strong> average success rate'
        ].join(''));
      }

    });

    return SuccessRateView;
});
