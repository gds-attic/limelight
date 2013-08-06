define([
  'extensions/collections/graphcollection'
],
function (GraphCollection) {

  var ApplicationMethodCollection = GraphCollection.extend({

    serviceName: 'lasting-power-of-attorney',
    apiName: 'volumes',

    initialize: function () {
      GraphCollection.prototype.initialize.apply(this, arguments);
      delete this.query.attributes.period;
    },

    parse: function (response) {
      var items = {
        "non_digital": {},
        "digital": {}
      };
      _.each(response.data, function(d) {
        var item = {};
        var applicationMethod = this.getApplicationMethod(d.key);
        if (!applicationMethod) {
          return;
        }
        if (items[applicationMethod][d._week_start_at]) {
          items[applicationMethod][d._week_start_at]._count += parseFloat(d.value);
        } else {
          items[applicationMethod][d._week_start_at] = {
            _count: parseFloat(d.value),
            _start_at: this.moment(d._week_start_at),
            _end_at: this.moment(d._week_start_at).add(1, 'weeks')
          };
        }
      }, this);
      _.each(items.digital, function(digitalItem, key, list) {
        var nonDigitalItem = items.non_digital[key];
        digitalItem['fraction'] = digitalItem._count / (digitalItem._count + nonDigitalItem._count);
        nonDigitalItem['fraction'] = 1 - digitalItem['fraction'];
      });
      _.each(items, function(group, key, items) {
        var sorted = _.sortBy(group, function(item) {
          return +item._end_at * -1;
        });
        items[key] = sorted.slice(0,13);
      });
      return [
        {
          id: 'non_digital',
          title: 'Non-digital',
          values: items.non_digital
        },
        {
          id: 'digital',
          title: 'Digital',
          values: items.digital
        }
      ];
    },

    getApplicationMethod: function (applicationMethod) {
      return {
        property_and_financial_digital_applications: 'digital',
        health_and_welfare_digital_applications: 'digital',
        property_and_financial_paper_applications: 'non_digital',
        health_and_welfare_paper_applications: 'non_digital'
      }[applicationMethod];
    }

  });

  return ApplicationMethodCollection;
});
