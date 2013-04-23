define([
  'extensions/collections/filteredcollection',
  'extensions/views/filter'
], function(Collection, Filter) {
  
  var collection = new Collection(
    $.map($('#licences-list li'), function (li) {
      var $li = $(li);
      return {
        id: $li.text(),
        el: $li
      };
    })
  );
  
  var view = new Filter({
    el: $('#filter-wrapper'),
    countEl: $('#licences-list .count'),
    label: 'Find an application, licence, notice or registration named:',
    placeholder: 'Example: Temporary Event Notice',
    collection: collection
  });
  view.render();
});
