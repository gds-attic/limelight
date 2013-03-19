define([
  'licensing/collections/totalandbyauthority',
  'licensing/views/applicationsperlicencegraph'
], function(Collection, Graph) {
  
  var collection = new Collection([], {
    licenceUrlSlug: $('#wrapper').data('licence-url-slug')
  });

  var view = new Graph({
    el: $('#applications-by-authority'),
    collection: collection
  });

  collection.fetch();
});
