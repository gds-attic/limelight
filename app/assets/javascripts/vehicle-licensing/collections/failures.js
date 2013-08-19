define([
  'require',
  'extensions/collections/collection',
  './failures-week'
],
function (require, Collection, FailuresWeek) {
  var Failures = Collection.extend({
    collections: [
      {
        collection: FailuresWeek,
        options: {
          ago: 0
        }
      },
      {
        collection: FailuresWeek,
        options: {
          ago: 1
        }
      }
    ],

    parse: function () {
      var last = this.collectionInstances[0];
      var previous = this.collectionInstances[1];

      var previousByReason = {};
      previous.each(function (model) {
        previousByReason[model.get('reason')] = model;
      });

      var totalCount = last.reduce(function (memo, model) {
        return memo + (model.get('count') || 0);
      }, 0);

      var res = last.map(function (model) {
        var modelPrevious = previousByReason[model.get('reason')]
        model.set({
          change: modelPrevious ? model.get('count') - modelPrevious.get('count') : null,
          fraction: model.get('count') / totalCount
        });

        return model.attributes;
      });

      return res;
    }
  });

  return Failures;
});
