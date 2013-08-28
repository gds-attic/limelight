define([
  'vehicle-licensing/collections/customer-satisfaction',
  'vehicle-licensing/views/customer-satisfaction-view'
],
  function (Collection, View) {
    return function (selector, service) {
      var collection = new Collection();

      var view = new View({
        el: $(selector),
        collection: collection,
        service: service
      });

      collection.fetch();
    };
  });