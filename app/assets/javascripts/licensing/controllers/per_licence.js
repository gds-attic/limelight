define([
  'licensing/collections/totalandbyauthority',
  'licensing/views/applicationsperlicencegraph',
  'licensing/collections/perlicencetable',
  'licensing/views/applicationstable'
], function(GraphCollection, GraphView, TableCollection, TableView) {
  
  var graphCollection = new GraphCollection([], {
    licenceUrlSlug: $('#wrapper').data('licence-url-slug')
  });

  var graphView = new GraphView({
    el: $('#applications-by-authority'),
    collection: graphCollection
  });

  graphCollection.fetch();
  
  
  var tableCollection = new TableCollection([], {
    licenceUrlSlug: $('#wrapper').data('licence-url-slug')
  });

  var tableView = new TableView({
    el: $('#applications-table'),
    collection: tableCollection
  });

  tableCollection.fetch();
  
});
