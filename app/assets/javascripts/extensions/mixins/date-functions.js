define(
  function () {
    return (function () {
      return {
        latest: function (objects, filter) {
          var dates = _.map(objects, filter);
          return _.reduce(dates, function (latest, current) {
            return current.isAfter(latest) ? current : latest;
          });
        },
        weeksFrom: function (latestDate, numberOfWeeksToGenerate) {
          return _.times(numberOfWeeksToGenerate, function (i) {
            var weeksAgo = numberOfWeeksToGenerate - i - 1;
            return latestDate.clone().subtract(weeksAgo, "weeks");
          });
        }
      }
    }());
  }
);