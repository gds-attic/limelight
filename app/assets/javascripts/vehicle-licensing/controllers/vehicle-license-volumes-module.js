define([
  'vehicle-licensing/collections/services',
  'extensions/views/timeseries-graph/timeseries-graph',
  'extensions/views/tabs',
  'extensions/views/graph/headline',
],
  function (ServicesCollection, TimeseriesGraph, Tabs, Headline) {
    return function (selector, id, type) {
      var serviceCollection = new ServicesCollection([], {
        seriesList: [{ id: id, title: type }]
      });
      serviceCollection.query.set('period', 'week');
      serviceCollection.fetch();

      new TimeseriesGraph({
        el: $(selector),
        collection: serviceCollection
      });

      var tabs = new Tabs({
        el: $(selector + '-nav'),
        model: serviceCollection.query,
        attr: 'period',
        tabs: [
          {id: "month", name: "Monthly"},
          {id: "week", name: "Weekly"}
        ]
      });
      tabs.render();

      var headline = new Headline({
        el: $(selector + '-headline'),
        model: serviceCollection.query,
        prefix: 'Applications submissions'
      });
      headline.render();
    };
  });
