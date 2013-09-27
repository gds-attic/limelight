define([
  'extensions/views/table/table'
],
  function (Table) {

    var HelpUsageTable = Table.extend({

      capitalize: function(string) {
        return string.replace(/(?:^|\s)\S/, function(letter) { return letter.toUpperCase(); });
      },

      sanitizeDescription: function (rawDescription) {
        var spaceSeparatedDescription = rawDescription.replace(/-/g, " "),
          lowercaseDescription = spaceSeparatedDescription.replace(/(\s|^)lpa(\s|$)/g, " LPA ");
        return this.capitalize(lowercaseDescription);
      },

      columns: [
        {
          id: 'description',
          title: 'Description',
          sortable: true,
          getValue: function (model) {
            return this.sanitizeDescription(model.get('description'));
          }
        },
        {
          id: 'count',
          className: 'count numeric',
          title: 'Usage last week',
          sortable: true,
          defaultDescending: true,
          getValue: function (model) {
            return this.formatNumericLabel(model.get('count'));
          }
        }
      ],

      defaultSortColumn: 1
    });

    return HelpUsageTable;
  });
