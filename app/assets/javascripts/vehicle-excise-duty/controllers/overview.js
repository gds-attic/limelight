define([
  'require',
  'vehicle-excise-duty/collections/services',
  'vehicle-excise-duty/collections/channels',
  'vehicle-excise-duty/views/timeseries-graph',
  './failures-module',
  'common/controllers/availability-module'
], function (require,
  ServicesCollection, ChannelsCollection, TimeseriesGraph,
  failuresModule, availabilityModule) {

  return function () {

    var servicesCollection = new ServicesCollection();
    var servicesGraph = new TimeseriesGraph({
      el: $('#vehicle-excise-duty-services'),
      collection: servicesCollection
    });
    servicesCollection.fetch();
    
    var channelsCollection = new ChannelsCollection();
    var channelsGraph = new TimeseriesGraph({
      el: $('#vehicle-excise-duty-channels'),
      collection: channelsCollection
    });
    channelsCollection.fetch();
    
    failuresModule('#tax-disc-failures', 'tax-disc');
    failuresModule('#sorn-failures', 'sorn');

    availabilityModule('tax-disc', '#tax-disc-availability');
    availabilityModule('register-sorn-statutory-off-road-notification', '#sorn-availability');
  };
});