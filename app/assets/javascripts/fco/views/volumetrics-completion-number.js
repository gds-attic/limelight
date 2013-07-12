define([
  'extensions/views/view'
],
function (View) {
  var modelsWith = function(property) {
    return function(model) {
      return !_.isUndefined(model.get(property));
    }
  }

  var get = function(property) {
    return function(model) {
      return model.get(property);
    }
  }

  var sum = function(a, b) {
    return a + b;
  }

  var contentString = function(value, caption) {
    return [ '<strong>', value, '%</strong>', caption ].join('');
  }

  var CompletionSelectedView = View.extend({
    initialize: function (attrs, options) {
      View.prototype.initialize.apply(this, arguments);
      this.collection.on('change:selected reset', this.render, this);
    },

    render: function () {
      View.prototype.render.apply(this, arguments);
      this.$el.html(this.content());
    },

    content:function () {
      var selection = this.collection.getCurrentSelection();

      if (selection.selectedModel) {
        var model = selection.selectedModel;
        var start = model.get('_start_at');
        var end = moment(model.get('_end_at')).subtract(1, 'days');

        var percentage = Math.round(selection.selectedModel.get('completion') * 100);

        var startLabel = start.format(start.month() === end.month() ? 'D' : 'D MMM');
        var endLabel = end.format('D MMM YYYY');
        return contentString(percentage, startLabel + ' - ' + endLabel);

      } else {
        var values = this.collection.at(0).get('values');
        var availableWeeks = values.filter(modelsWith('_id'));
        var total = availableWeeks.map(get('completion')).reduce(sum);
        var percentage = Math.round(100 * total / availableWeeks.length);

        return contentString(percentage, ' mean over the last ' + availableWeeks.length + ' weeks');
      }
    }
  });


  return CompletionSelectedView;
});
