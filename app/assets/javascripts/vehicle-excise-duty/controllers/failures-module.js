define([
  'vehicle-excise-duty/collections/failures',
  'vehicle-excise-duty/views/failures-table'
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
