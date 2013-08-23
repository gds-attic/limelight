define([
  'extensions/collections/filteredcollection',
  'extensions/models/model',
  'extensions/views/filter-view',
  'extensions/views/collection-counter',
  'extensions/views/filtered-list'
], function(Collection, Model, Filter, CollectionCounter, FilteredList) {
  return function() {
    var filterTerm = new Model();

    var parseList = function (li) {
      var $li = $(li);
      return {
        title: $li.text(),
        el: $li
      };
    };

    var servicesCollection = new Collection(
      $.map($('#services-list li'), parseList), {filterTerm: filterTerm}
    );

    var serviceGroupsCollection = new Collection(
      $.map($('#service-groups-list li'), parseList), {filterTerm: filterTerm}
    ); 

    var filter = new Filter({ 
      el: $('#filter-wrapper'),
      label: 'Find a service named:',
      placeholder: 'Example: Licensing',
      model: filterTerm
    });
    var servicesCount = new CollectionCounter({
      el: $('#services-list .count'),
      collection: servicesCollection.filtered
    });
    var serviceGroupsCount = new CollectionCounter({
      el: $('#service-groups-list .count'),
      collection: serviceGroupsCollection.filtered
    });
    var filteredService = new FilteredList({
      el: $('#services-list dl'),
      collection: servicesCollection
    });
    var filteredServicesGroups = new FilteredList({
      el: $('#service-groups-list dl'),
      collection: serviceGroupsCollection
    });

    filter.render();
  };
});
