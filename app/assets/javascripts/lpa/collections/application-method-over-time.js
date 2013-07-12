define([
  'extensions/collections/graphcollection'
],
function (GraphCollection) {

  var ApplicationMethodCollection = GraphCollection.extend({

    serviceName: 'lasting-power-of-attorney',
    apiName: 'volumes',

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
        if (items[applicationMethod][d.start_at]) {
          items[applicationMethod][d.start_at]._count += parseFloat(d.value);
        } else {
          items[applicationMethod][d.start_at] = {
            _count: parseFloat(d.value),
            _start_at: this.moment(d.start_at),
            _end_at: this.moment(d.end_at)
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
      if (applicationMethod === "property_and_financial_digital_applications"
        || applicationMethod === "health_and_welfare_digital_applications") {
        return "digital";
      } else if (applicationMethod === "property_and_financial_paper_applications"
        || applicationMethod === "health_and_welfare_paper_applications") {
        return "non_digital";
      }
    }

  });

  return ApplicationMethodCollection;
});
