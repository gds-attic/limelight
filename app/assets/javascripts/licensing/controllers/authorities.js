define([
  'extensions/collections/filteredcollection',
  'extensions/models/model',
  'extensions/views/filter-view',
  'extensions/views/collection-counter',
  'extensions/views/filtered-list'
], function(Collection, Model, Filter, CollectionCounter, FilteredList) {
  return function () {
    var filterTerm = new Model();

    var collection = new Collection(
      $.map($('#authorities-list li'), function (li) {
        var $li = $(li);
        return {
          title: $li.text(),
          el: $li
        };
      }), {filterTerm: filterTerm}
    );

    var filter = new Filter({ 
      el: $('#filter-wrapper'),
      label: 'Find a licencing authority named:',
      placeholder: 'Example: Westminster',
      model: filterTerm
    });
    var servicesCount = new CollectionCounter({
      el: $('#authorities-list .count'),
      collection: collection.filtered
    });
    var filteredService = new FilteredList({
      el: $('#authorities-list dl'),
      collection: collection
    });

    filter.render();
  };
});
