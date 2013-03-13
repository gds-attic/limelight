define([
  'licensing/collections/applications',
  'licensing/views/totalapplications'
], function(ApplicationsCollection, TotalApplicationsView) {

  if (window.jasmine) {
    // do not initialise app when unit testing
    return;
  }

  var collection = new ApplicationsCollection();

  var view = new TotalApplicationsView({
    el: $('#total-applications'),
    collection: collection
  });

  collection.fetch();
});
