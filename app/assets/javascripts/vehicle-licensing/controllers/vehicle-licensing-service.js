define([
  'require',
  './failures-module',
  'common/controllers/availability-module',
  './vehicle-license-volumes-module',
  'extensions/collections/visitors-realtime',
  'extensions/views/visitors-realtime'
], function (require, failuresModule, availabilityModule, volumesModule, RealtimeCollection, RealtimeView) {

  return function () {
    var service = $('#wrapper').data('service-name'),
        serviceNames = {
          'sorn': 'register-sorn-statutory-off-road-notification',
          'tax-disc': 'tax-disc'
        },
      serviceName = serviceNames[service];

    volumesModule('#' + service + '-volumes', 'successful_' + service.replace("-", "_"), service);

    failuresModule('#' + service + '-failures', service);

    availabilityModule(serviceName, '#' + service + '-availability');

    var updateInterval = 120*1000;

    var realtimeCollection = new RealtimeCollection([],{
      serviceName: serviceName
    });

    var realtimeView = new RealtimeView({
      el: $('#' + service + '-realtime'),
      collection: realtimeCollection,
      collectionUpdateInterval: updateInterval
    });

    realtimeCollection.fetch();

    setInterval(function () {
      realtimeCollection.fetch();
    }, updateInterval);

  };
});
