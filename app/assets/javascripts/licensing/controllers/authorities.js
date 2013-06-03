define([
  'extensions/collections/filteredcollection',
  'extensions/views/filter'
], function(Collection, Filter) {
  return function () {
    var collection = new Collection(
      $.map($('#authorities-list li'), function (li) {
        var $li = $(li);
        return {
          title: $li.text(),
          el: $li
        };
      })
    );

    var view = new Filter({
      el: $('#filter-wrapper'),
      listEl: $('#authorities-list dl'),
      countEl: $('#authorities-list .count'),
      label: 'Find a licencing authority named:',
      placeholder: 'Example: Westminster',
      collection: collection
    });
    view.render();
  };
});
