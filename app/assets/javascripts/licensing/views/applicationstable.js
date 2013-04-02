define([
  'extensions/table/table'
],
function (Table) {
  var ApplicationsTable = Table.extend({
    
    lazyRender: true,
    
    columns: [
      {
        id: 'authorityName',
        title: 'Licence',
        sortable: true,
        getValue: function (model) {
          var res = model.get('authorityName');
          var licence = model.get('licenceName');
          if (licence) {
            res = licence + ' &ndash; ' + res;
          }
          return res;
        }
      },
      {
        id: '_count',
        title: 'Licence applications',
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
