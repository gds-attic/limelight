define([
  'extensions/views/table/table'
],
function (Table) {
  var FailuresTable = Table.extend({
    
    columns: [
      {
        id: 'description',
        title: 'Description',
        sortable: true
      },
      {
        id: 'count',
        title: 'Occurrences last week',
        sortable: true,
        defaultDescending: true,
        getValue: function (model) {
          return this.formatNumericLabel(model.get('count'));
        }
      }
    ],
    
    defaultSortColumn: 1
  });
  
  return FailuresTable;
});
