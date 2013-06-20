define([
  'licensing/collections/applications-total-weekly',
  'licensing/views/applications-graph/applicationsgraph',
  'licensing/views/applications-graph/headline',
  'licensing/collections/applications-top5-lastweek',
  'licensing/views/top5table',
  'extensions/collections/graphcollection',
  'licensing/collections/conversion',
  'extensions/views/conversion-graph/conversion-graph',
  'extensions/views/tabs',
  'extensions/views/conversion-success-rate',
  'extensions/collections/visitors-realtime',
  'extensions/views/visitors-realtime'
], function (ApplicationsCollection, ApplicationsGraph, ApplicationsHeadlineView,
             Top5Collection, Top5Table, GraphCollection,
             ConversionCollection, ConversionGraph,
             Tabs, SuccessRateView,
             VisitorsRealtimeCollection, VisitorsRealtimeView) {
  return function () {

    var conversionCollection = new ConversionCollection();

    var successRate = new SuccessRateView({
      el: $('#applications-success-rate'),
      collection: conversionCollection.collectionInstances[1],
      startStep: "licensingUserJourney:downloadFormPage",
      endStep: "licensingUserJourney:end"
    });

    if (!$('.lte-ie8').length) {
      var applicationsCollection = new GraphCollection(null, {
        collections: [ApplicationsCollection]
      });
      var graphView = new ApplicationsGraph({
        el: $('#total-applications'),
        collection: applicationsCollection
      });

      var graphNav = new Tabs({
        el: $("#applications-nav"),
        model: applicationsCollection.query,
        attr: 'period',
        tabs: [
          {id: "month", name: "Monthly"},
          {id: "week", name: "Weekly"}
        ]
      });

      var graphHeadline = new ApplicationsHeadlineView({
        el: $('#total-applications').siblings('h2'),
        model: applicationsCollection.query
      });

      applicationsCollection.query.set('period', 'week');

      var conversionGraph = new ConversionGraph({
        el: $('#applications-conversion-graph'),
        collection: conversionCollection
      });
    }

    conversionCollection.fetch();


    var top5LicencesCollection = new Top5Collection([], {
      groupBy: 'licenceUrlSlug'
    });

    var top5LicencesTable = new Top5Table({
      title: 'Licence',
      el: $('#top5-licences-table'),
      collection: top5LicencesCollection
    });

    top5LicencesCollection.fetch();


    var top5AuthoritiesCollection = new Top5Collection([], {
      groupBy: 'authorityUrlSlug'
    });

    var top5AuthoritiesTable = new Top5Table({
      title: 'Authority',
      el: $('#top5-authorities-table'),
      collection: top5AuthoritiesCollection
    });

    top5AuthoritiesCollection.fetch();

    if ($('#number-of-visitors-realtime').length) {
      var updateInterval = 120 * 1000;
      var visitorsRealtimeCollection = new VisitorsRealtimeCollection([],{
        serviceName: "licensing"
      });

      var visitorsRealtimeView = new VisitorsRealtimeView({
        el: $('#number-of-visitors-realtime'),
        collection: visitorsRealtimeCollection,
        collectionUpdateInterval: updateInterval
      });

      visitorsRealtimeCollection.fetch();

      setInterval(function () {
        visitorsRealtimeCollection.fetch();
      }, updateInterval);
    }
  };
});
