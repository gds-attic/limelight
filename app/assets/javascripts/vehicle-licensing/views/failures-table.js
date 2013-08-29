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
        className: 'count numeric',
        title: 'Volume last week',
        sortable: true,
        defaultDescending: true,
        getValue: function (model) {
          return this.formatNumericLabel(model.get('count'));
        }
      },
      {
        id: 'fraction',
        className: 'fraction numeric',
        title: 'Percentage of total errors',
        sortable: true,
        defaultDescending: true,
        getValue: function (model) {
          return this.formatPercentage(model.get('fraction'));
        }
      },
      {
        id: 'change',
        className: 'change numeric',
        title: 'Change from previous week',
        sortable: true,
        defaultDescending: true,
        getValue: function (model) {
          var change = model.get('change');
          if (change == null) {
            return '-';
          }

          var displayValue = this.formatNumericLabel(Math.abs(change));
          if (change > 0) {
            return '<span class="increase decline">+' + displayValue + '</span>';
          } else if (change < 0) {
            return '<span class="decrease improvement">&minus;' + displayValue + '</span>';
          } else {
            return '0';
          }
        }
      }
    ],
    
    defaultSortColumn: 1
  });
  
  return FailuresTable;
});
