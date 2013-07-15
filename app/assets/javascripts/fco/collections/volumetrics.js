define([
  'extensions/collections/graphcollection',
  'extensions/models/group'
],
function (GraphCollection, Group) {

  var VolumetricsCollection = GraphCollection.extend({
    model: Group,

    apiName: 'journey',

    initialize: function (models, options) {
      this.serviceName = options.serviceName;
      GraphCollection.prototype.initialize.apply(this, arguments);
      this.query.set('period', 'week', {silent: true, utc: false});
      delete this.query.attributes.period;
    },

    parse: function (response) {
      var dataByEvent = {};
      _.each(response.data, function (d) {
        d['_timestamp'] = moment(d['_timestamp']);
        var stage = d.eventCategory.split(':')[1];
        if (!dataByEvent[stage]) {
          dataByEvent[stage] = [];
        }
        dataByEvent[stage].push(d);
      });

      var start = this.query.get('start_at');
      var end = this.query.get('end_at');
      
      var parseSeries = function (stageId, stageTitle) {
        var series = dataByEvent[stageId];

        var date = moment(start);
        var values = [];
        for (; +date < +end; date.add(1, 'weeks')) {
          var entry = _.find(series, function (d) {
            return +d['_timestamp'] === +date;
          });

          values.push(_.extend({
            uniqueEvents: 0,
            // FIXME: Adding one hour to start and end to work around timezone 
            // issues. Revert once Backdrop handles timezones correctly.
            _start_at: moment(date).add(1, 'hours'),
            _end_at: moment(date).add(1, 'weeks').add(1, 'hours')
          }, entry));
        }
        return {
          id: stageId,
          title: stageTitle,
          values: values
        };
      };

      var data = [
        parseSeries('start', 'Start'),
        parseSeries('done', 'Done')
      ];

      var completionValues = _.map(data[1].values, function (entry, index) {
        var completion = entry.uniqueEvents / data[0].values[index].uniqueEvents || 0;
        return _.extend({}, entry, {
          completion: completion
        });
      });

      data.push({
        id: 'completion',
        title: 'Completion rate',
        values: completionValues
      });
      return data;
    }
  });

  return VolumetricsCollection;
});
