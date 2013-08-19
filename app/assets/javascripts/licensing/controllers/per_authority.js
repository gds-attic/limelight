define([
  'licensing/collections/applications-totalandtop5licences-weekly',
  'extensions/views/timeseries-graph/multi-timeseries-graph',
  'licensing/collections/all-entities-and-applications-lastweek',
  'licensing/views/applicationstable',
  'extensions/views/tabs',
  'extensions/views/graph/headline',
], function (GraphCollection, GraphView, TableCollection, TableView, Tabs, HeadlineView) {
  return function () {

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
        el: $('#applications-by-licence').siblings('h2'),
        model: graphCollection.query,
        postfix: 'and top licences by submission volume in this time'
      });

      graphCollection.query.set('period', 'week');
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
  };
});
