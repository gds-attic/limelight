define([
    'extensions/views/view',
    'extensions/collections/filteredcollection'
],
function (View, Collection) {
  var CollectionFilter = View.extend ({
    initialize: function (options) {
      View.prototype.initialize.apply(this, arguments);
      this.collection.filtered.on('reset', this.render, this);
    },
    
    render: function () {
      this.collection.each(function (model) {
        model.get('el').addClass('performance-hidden');
      });
      this.collection.filtered.each(function (model) {
        model.get('el').removeClass('performance-hidden');
      });
      
      // hide groups that have no visible children
      this.$el.find('dd, dt').removeClass('performance-hidden');
      this.$el.find('dd').each(function (i, dd) {
        var $dd = $(dd);
        if (!$dd.find('li:not(.performance-hidden)').length) {
          // no children visible, hide group too
          $dd.addClass('performance-hidden');
          $dd.prev('dt').addClass('performance-hidden');
        }
      });
    }
  });
  return CollectionFilter;
});
