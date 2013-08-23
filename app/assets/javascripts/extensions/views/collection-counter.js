define([
    'extensions/views/view'
],
function (View) {
  var CollectionCounter = View.extend ({
    initialize: function (options) {
      View.prototype.initialize.apply(this, arguments);
      this.collection.on('reset', this.render, this);
    },
    
    render: function () {
      this.$el.text(this.collection.length);
    }
  });
  return CollectionCounter;
});
