define([
  'extensions/collections/collection'
],
function (Collection) {
  var maxScore = 5, minScore = 1;

  var scoreToPercentage = function(score) {
    return (maxScore - score) / (maxScore - minScore);
  }

  var CustomerSatisfaction = Collection.extend({

    serviceName: "vehicle-licensing",
    apiName: "customer-satisfaction",

    parse: function(response) {
      return _.map(response.data, function(entry) {
        return _.extend(entry, {
          satisfaction_sorn: scoreToPercentage(entry.satisfaction_sorn),
          satisfaction_tax_disc: scoreToPercentage(entry.satisfaction_tax_disc)
        });
      });
    }
  });

  return CustomerSatisfaction;
});
