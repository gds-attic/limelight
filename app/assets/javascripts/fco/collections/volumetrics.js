define([
  'extensions/collections/collection',
  'extensions/models/group',
  'extensions/mixins/date-functions'
],
function (Collection, Group, dateFunctions) {
  var START_STAGE_MATCHER = /start$/;
  var DONE_STAGE_MATCHER = /done$/;

  function uniqueEventsFor(data, matcher) {
    var events = _.filter(data, function (d) {
      return d.eventCategory.match(matcher) !== null;
    });

    if (events.length === 0) {
      return 0;
    }

    return _.reduce(events, function (mem, d) { return mem + d.uniqueEvents; }, 0);
  }

  function findCompletion(event) {
    var completion = null;

    if (event != null) {
      completion = event.totalCompleted / event.totalStarted;
    }
    return completion;
  }

  function getEventForTimestamp(events, timestamp) {
    return _.find(events, function (d) {
      return moment(d._timestamp).isSame(timestamp);
    });
  }

  function eventsFrom(data) {
    var eventsByTimestamp = _.groupBy(data, function (d) { return d._timestamp; });

    return _.map(eventsByTimestamp, function (events) {
      return {
        _timestamp: events[0]._timestamp,
        totalStarted: uniqueEventsFor(events, START_STAGE_MATCHER),
        totalCompleted: uniqueEventsFor(events, DONE_STAGE_MATCHER)
      };
    });
  }

  var VolumetricsCollection = Collection.extend({
    model: Group,

    apiName: 'journey',

    initialize: function (models, options) {
      this.serviceName = options.serviceName;
      Collection.prototype.initialize.apply(this, arguments);
      this.query.set('period', 'week', {silent: true, utc: false});
      delete this.query.attributes.period;
    },

    numberOfJourneyStarts: function () {
      var data = this.pluck('data')[0];
      return uniqueEventsFor(data, START_STAGE_MATCHER);
    },

    numberOfJourneyCompletions: function () {
      var data = this.pluck('data')[0];
      return uniqueEventsFor(data, DONE_STAGE_MATCHER);
    },

    completionRate: function () {
      return this.numberOfJourneyCompletions() / this.numberOfJourneyStarts();
    },

    series: function (config) {
      var data = this.pluck('data')[0];
      var events = eventsFrom(data);

      var weeksWithData = events.length;

      var earliestEventTimestamp = dateFunctions.earliest(events, function (d) { return moment(d._timestamp); });
      var latestEventTimestamp = dateFunctions.latest(events, function (d) { return moment(d._timestamp); });
      var weekDates = dateFunctions.weeksFrom(latestEventTimestamp, 9);

      var values = _.map(weekDates, function (timestamp) {
        var existingEvent = getEventForTimestamp(events, timestamp);
        return _.extend(config.modelAttribute(existingEvent), {
          _start_at: timestamp.clone().add(1, 'hours'),
          _end_at: timestamp.clone().add(1, 'hours').add(1, 'weeks')
        });
      });

      return _.extend(config.collectionAttribute(events), {
        id: config.id,
        title: config.title,
        weeks: {
          total: dateFunctions.numberOfWeeksInPeriod(earliestEventTimestamp, latestEventTimestamp) + 1,
          available: weeksWithData
        },
        values: new Collection(values)
      });
    },

    applicationsSeries: function () {
      var that = this;
      var applicationConfiguration = {
        id: "done",
        title: "Done",
        modelAttribute: function (event) {
          return {
            uniqueEvents: _.isUndefined(event) ? null : event.totalCompleted
          };
        },
        collectionAttribute: function (events) {
          return {
            mean: that.numberOfJourneyCompletions() / events.length
          };
        }
      }

      return this.series(applicationConfiguration);
    },

    completionSeries: function () {
      var that = this;
      var completionConfiguration = {
        id: "completion",
        title: "Completion rate",
        modelAttribute: function (event) {
          return {
            completion: findCompletion(event)
          };
        },
        collectionAttribute: function () {
          return {
            totalCompletion: that.completionRate()
          };
        }
      }

      return this.series(completionConfiguration);
    }
  });

  return VolumetricsCollection;
});
