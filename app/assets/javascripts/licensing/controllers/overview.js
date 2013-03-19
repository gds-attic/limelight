define([
  'licensing/collections/applications',
  'licensing/views/applicationsgraph'
], function(ApplicationsCollection, ApplicationsGraph) {
  
  var collection = new ApplicationsCollection();

  var view = new ApplicationsGraph({
    el: $('#total-applications'),
    collection: collection
  });

  collection.fetch();
});
