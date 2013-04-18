define([
  'licensing/collections/applications-totalandtop5licences-weekly',
  'licensing/views/applicationsperlicencegraph',
  'licensing/collections/all-entities-and-applications-lastweek',
  'licensing/views/applicationstable'
], function(GraphCollection, GraphView, TableCollection, TableView) {
  
  var authorityUrlSlug = $('#wrapper').data('authority-url-slug');
  
  if (!$('.lte-ie8').length) {
    var graphCollection = new GraphCollection([], {
      filterBy: {
        authorityUrlSlug: authorityUrlSlug
      }
    });

    var graphView = new GraphView({
      el: $('#applications-by-licence'),
      collection: graphCollection
    });

    graphCollection.fetch();
  }
  
  var tableCollection = new TableCollection([], {
    groupBy: 'licenceUrlSlug',
    filterBy: {
      authorityUrlSlug: authorityUrlSlug
    }
  });
  
  var tableView = new TableView({
    el: $('#applications-table'),
    collection: tableCollection
  });
  
  tableCollection.fetch();
});
