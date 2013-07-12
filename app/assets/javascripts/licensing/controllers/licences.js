define([
  'extensions/collections/filteredcollection',
  'extensions/views/filter'
], function (Collection, Filter) {
  return function () {
    var collection = new Collection(
      $.map($('#licences-list li'), function (li) {
        var $li = $(li);
        return {
          title: $li.text(),
          el: $li
        };
      })
    );

    var view = new Filter({
      el: $('#filter-wrapper'),
      listEl: $('#licences-list dl'),
      countEl: $('#licences-list .count'),
      label: 'Find an application, licence, notice or registration named:',
      placeholder: 'Example: Temporary event notice',
      collection: collection
    });
    view.render();
  };
});
