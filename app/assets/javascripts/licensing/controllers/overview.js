define([
  'licensing/collections/applications-total-weekly',
  'licensing/views/applicationsgraph',
  'licensing/collections/applications-top5-lastweek',
  'licensing/views/top5table',
  'extensions/collections/graphcollection',
  'licensing/collections/applications-conversion',
  'licensing/views/applications-conversion-graph'
], function(ApplicationsCollection, ApplicationsGraph, Top5Collection, Top5Table, GraphCollection, ConversionCollection, ConversionGraph) {
  
  if (!$('.lte-ie8').length) {
    var applicationsCollection = new ApplicationsCollection();
    var graphView = new ApplicationsGraph({
      el: $('#total-applications'),
      collection: applicationsCollection
    });
    applicationsCollection.fetch();
    
    var conversionCollection = new GraphCollection(null, {
      collections: [ConversionCollection]
    });
    var conversionGraph = new ConversionGraph({
      el: $('#applications-conversion-graph'),
      collection: conversionCollection
    });
    conversionCollection.fetch();
  }
  
  
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
});
