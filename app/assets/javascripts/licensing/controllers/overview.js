define([
  'licensing/collections/applications-total-weekly',
  'licensing/views/applicationsgraph',
  'licensing/collections/applications-top5-lastmonth',
  'licensing/views/top5table'
], function(GraphCollection, ApplicationsGraph, Top5Collection, Top5Table) {
  
  if (!$('.lte-ie8').length) {
    var graphCollection = new GraphCollection();
    var graphView = new ApplicationsGraph({
      el: $('#total-applications'),
      collection: graphCollection
    });
    graphCollection.fetch();
  }
  
  
  var top5LicencesCollection = new Top5Collection([], {
    groupBy: 'licenceUrlSlug'
  });
  
  var top5LicencesTable = new Top5Table({
    title: 'Licence name',
    el: $('#top5-licences-table'),
    collection: top5LicencesCollection
  });
  
  top5LicencesCollection.fetch();

  
  var top5AuthoritiesCollection = new Top5Collection([], {
    groupBy: 'authorityUrlSlug'
  });
  
  var top5AuthoritiesTable = new Top5Table({
    title: 'Authority name',
    el: $('#top5-authorities-table'),
    collection: top5AuthoritiesCollection
  });
  
  top5AuthoritiesCollection.fetch();
  
});
