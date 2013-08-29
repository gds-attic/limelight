define([
  'extensions/collections/collection',
  'extensions/models/group',
  'extensions/mixins/date-functions'
],
function (Collection, Group, dateFunctions) {
  var START_STAGE_MATCHER = /start$/;
  var DONE_STAGE_MATCHER = /done$/;

  function filterByEventCategory(data, matcher) {
    return _.filter(data, function (d) {
      return d.eventCategory.match(matcher) !== null;
    });
  }

  function findCompletion(existingStartedEvent, existingCompletedEvent) {
    var completion = 0;
    if (_.isObject(existingStartedEvent) && _.isObject(existingCompletedEvent)) {
      completion = existingCompletedEvent.uniqueEvents / existingStartedEvent.uniqueEvents;
    }
    return completion;
  }

  function getEventForTimestamp(events, timestamp) {
    return _.find(events, function (d) {
      return moment(d._timestamp).isSame(timestamp);
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
      var startedEvents = filterByEventCategory(data, START_STAGE_MATCHER);
      return _.reduce(startedEvents, function (mem, d) { return mem + d.uniqueEvents; }, 0);
    },

    numberOfJourneyCompletions: function () {
      var data = this.pluck('data')[0];
      var completionEvents = filterByEventCategory(data, DONE_STAGE_MATCHER);
      return _.reduce(completionEvents, function (mem, d) { return mem + d.uniqueEvents; }, 0);
    },

    completionRate: function () {
      return this.numberOfJourneyCompletions() / this.numberOfJourneyStarts();
    },

    applicationsSeries: function () {
      var data = this.pluck('data')[0];
      var applicationEvents = filterByEventCategory(data, DONE_STAGE_MATCHER);

      var latestEventTimestamp = dateFunctions.latest(data, function (d) { return moment(d._timestamp); });
      var weekDates = dateFunctions.weeksFrom(latestEventTimestamp, 9);

      var values = _.map(weekDates, function (timestamp) {
        var existingEvent = getEventForTimestamp(applicationEvents, timestamp);
        return {
          _start_at: timestamp.clone().add(1, 'hours'),
          _end_at: timestamp.clone().add(1, 'hours').add(1, 'weeks'),
          uniqueEvents: _.isUndefined(existingEvent) ? 0 : existingEvent.uniqueEvents
        };
      });

      return {
        id: "done",
        title: "Done",
        weeksWithData: applicationEvents.length,
        mean: this.numberOfJourneyCompletions() / applicationEvents.length,
        values: new Collection(values)
      };
    },

    completionSeries: function () {
      var data = this.pluck('data')[0];
      var startedApplicationEvents = filterByEventCategory(data, START_STAGE_MATCHER);
      var completedApplicationEvents = filterByEventCategory(data, DONE_STAGE_MATCHER);

      var latestEventTimestamp = dateFunctions.latest(data, function (d) { return moment(d._timestamp); });
      var weekDates = dateFunctions.weeksFrom(latestEventTimestamp, 9);

      var values = _.map(weekDates, function (timestamp) {
        var existingStartEvent = getEventForTimestamp(startedApplicationEvents, timestamp);
        var existingCompletionEvent = getEventForTimestamp(completedApplicationEvents, timestamp);
        return {
          _start_at: timestamp.clone().add(1, 'hours'),
          _end_at: timestamp.clone().add(1, 'hours').add(1, 'weeks'),
          completion: findCompletion(existingStartEvent, existingCompletionEvent)
        };
      });

      return {
        id: "completion",
        title: "Completion rate",
        weeksWithData: completedApplicationEvents.length,
        totalCompletion: this.completionRate(),
        values: new Collection(values)
      };
    }
  });

  return VolumetricsCollection;
});
