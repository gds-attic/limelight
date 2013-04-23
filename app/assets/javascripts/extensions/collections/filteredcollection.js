define([
  'extensions/collections/collection'
],
function (Collection) {
  var FilteredCollection = Collection.extend({
    
    constructor: function () {
      Collection.prototype.constructor.apply(this, arguments);
      this.trigger('reset');
    },
    
    initialize: function () {
      Collection.prototype.initialize.apply(this, arguments);
      this.filtered = new Collection();
      this.on('reset', this.resetFilter, this);
    },
    
    resetFilter: function () {
      this.filtered.reset(this.models);
    },
    
    applyFilter: function (term) {
      this.term = term;
      this.filtered.reset(this.filter(function (model) {
        if (model.get('id').toLowerCase().indexOf(term.toLowerCase()) >= 0) {
          return model;
        }
      }), this);
    }
  });
  
  return FilteredCollection;
});
