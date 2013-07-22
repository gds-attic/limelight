define([
  'extensions/collections/graphcollection'
],
function (GraphCollection) {

  var ContactMethodCollection = GraphCollection.extend({

    serviceName: 'hmrc_preview',
    apiName: 'volumes',

    parse: function (response) {
      var items = {
        "baseline": {},
        "nondigital": {},
        "digital": {}
      };
      _.each(response.data, function(d) {
        var item = {};
        var contactMethod = d.category;
        if (!contactMethod) {
          return;
        }
        if (items[contactMethod][d.start_at]) {
          items[contactMethod][d.start_at]._count += parseFloat(d.number);
        } else {
          items[contactMethod][d.start_at] = {
            _count: parseFloat(d.number),
            _start_at: this.moment(d.start_at),
            _end_at: this.moment(d.end_at)
          };
        }
      }, this);
      _.each(items, function(group, key, items) {
        var sorted = _.sortBy(group, function(item) {
          return +item._end_at * -1;
        });
        items[key] = sorted;
      });
      return [
        {
          id: 'baseline',
          title: 'Historical',
          values: items.baseline
        },
        {
          id: 'digital',
          title: 'Digital',
          values: items.digital
        },
        {
          id: 'nondigital',
          title: 'Non-digital',
          values: items.nondigital
        }      
      ];
    }

  });

  return ContactMethodCollection;
});
