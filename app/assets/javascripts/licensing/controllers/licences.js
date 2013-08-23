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
      $.map($('#licences-list li'), function (li) {
        var $li = $(li);
        return {
          title: $li.text(),
          el: $li
        };
      }), {filterTerm: filterTerm}
    );

    var filter = new Filter({ 
      el: $('#filter-wrapper'),
      label: 'Find an application, licence, notice or registration named:',
      placeholder: 'Example: Temporary event notice',
      model: filterTerm
    });
    var servicesCount = new CollectionCounter({
      el: $('#licences-list .count'),
      collection: collection.filtered
    });
    var filteredService = new FilteredList({
      el: $('#licences-list dl'),
      collection: collection
    });

    filter.render();
  };
});
