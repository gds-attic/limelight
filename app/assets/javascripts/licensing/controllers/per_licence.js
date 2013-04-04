define([
  'licensing/collections/applications-totalandtop5authorities-weekly',
  'licensing/views/applicationsperlicencegraph',
  'licensing/collections/applications-detail-lastweek',
  'licensing/views/applicationstable'
], function(GraphCollection, GraphView, TableCollection, TableView) {
  
  var licenceUrlSlug = $('#wrapper').data('licence-url-slug');
  
  if (!$('.lte-ie8').length) {
    var graphCollection = new GraphCollection([], {
      filterBy: {
        licenceUrlSlug: licenceUrlSlug
      }
    });

    var graphView = new GraphView({
      el: $('#applications-by-authority'),
      collection: graphCollection
    });

    graphCollection.fetch();
  }
  
  var tableCollection = new TableCollection([], {
    groupBy: 'authorityUrlSlug',
    filterBy: {
      licenceUrlSlug: licenceUrlSlug
    }
  });

  var tableView = new TableView({
    el: $('#applications-table'),
    collection: tableCollection
  });

  tableCollection.fetch();
  
});
