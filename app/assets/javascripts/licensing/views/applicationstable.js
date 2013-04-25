define([
  'extensions/views/table/table'
],
function (Table) {
  var ApplicationsTable = Table.extend({
    
    lazyRender: true,
    
    columns: [
      {
        id: 'sortName',
        className: 'js_group',
        title: function () {
          return this.options.title || 'Licence';
        },
        sortable: true,
        getValue: function (model) {
          return $('<a>').text(model.get('name')).prop('href', model.get('url'));
        }
      },
      {
        id: '_count',
        title: 'Submissions last week',
        sortable: true,
        defaultDescending: true,
        getValue: function (model) {
          return this.formatNumericLabel(model.get('_count'));
        }
      }
    ],
    
    defaultSortColumn: 1
  });
  
  return ApplicationsTable;
});
