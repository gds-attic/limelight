define([
  'licensing/collections/applications-totalandtop5authorities-weekly',
  'extensions/views/timeseries-graph/multi-timeseries-graph',
  'licensing/collections/all-entities-and-applications-lastweek',
  'licensing/views/applicationstable',
  'extensions/views/tabs',
  'extensions/views/graph/headline',
], function (GraphCollection, GraphView, TableCollection, TableView, Tabs, HeadlineView) {
  return function () {

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

      var graphNav = new Tabs({
        el: $("#applications-nav"),
        model: graphCollection.query,
        attr: 'period',
        tabs: [
          {id: "month", name: "Monthly"},
          {id: "week", name: "Weekly"}
        ]
      });

      var graphHeadline = new HeadlineView({
        el: $('#applications-by-authority').siblings('h2'),
        model: graphCollection.query,
        postfix: 'and top authorities by volume in this time'
      });

      graphCollection.query.set('period', 'week');
    }

    var tableCollection = new TableCollection([], {
      groupBy: 'authorityUrlSlug',
      filterBy: {
        licenceUrlSlug: licenceUrlSlug
      }
    });

    var tableView = new TableView({
      el: $('#applications-table'),
      collection: tableCollection,
      title: 'Authority'
    });

    tableCollection.fetch();
  };
});
