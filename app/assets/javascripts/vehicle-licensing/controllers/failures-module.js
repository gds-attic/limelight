define([
  'vehicle-licensing/collections/failures',
  'vehicle-licensing/views/failures-table'
],
function (Collection, View) {
  return function (selector, type) {
    var collection = new Collection([], {
      type: type
    });
    
    var view = new View({
      el: $(selector + ' .failures-table'),
      collection: collection
    });

    collection.fetch();
  };
});
