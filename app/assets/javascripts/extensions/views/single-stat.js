define([
  'extensions/views/view'
],
function (View) {
  var SingleStatView = View.extend({

    changeOnSelected: false,
    valueTag: 'strong',

    initialize: function () {
      View.prototype.initialize.apply(this, arguments);

      var events = 'reset';
      if (this.changeOnSelected) {
        events += ' change:selected';
      }
      this.collection.on(events, this.render, this);
    },

    render: function () {
      View.prototype.render.apply(this, arguments);

      var value, label;
      var selection = this.collection.getCurrentSelection();
      if (this.changeOnSelected && selection.selectedModel) {
        value = this.getValueSelected(selection);
        label = this.getLabelSelected(selection);
      } else {
        value = this.getValue();
        label = this.getLabel();
      }

      var content = value;
      if (this.valueTag) {
        content = '<' + this.valueTag + '>' + value + '</' + this.valueTag + '>';
      } 
      if (label) {
        content += ' ' + label;
      }
      this.$el.html(content);
    },

    getLabel: function () {
      return '';
    },

    getLabelSelected: function () {
      return '';
    }
  });

  return SingleStatView;
});
