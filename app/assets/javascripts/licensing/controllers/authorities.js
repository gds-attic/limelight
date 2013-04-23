define([
  'extensions/collections/filteredcollection',
  'extensions/views/filter'
], function(Collection, Filter) {
  
  var collection = new Collection(
    $.map($('#authorities-list li'), function (li) {
      var $li = $(li);
      return {
        id: $li.text(),
        el: $li
      };
    })
  );
  
  var view = new Filter({
    el: $('#filter-wrapper'),
    countEl: $('#authorities-list .count'),
    label: 'Find a licencing authority named:',
    placeholder: 'Example: Westminster',
    collection: collection
  });
  view.render();
});
