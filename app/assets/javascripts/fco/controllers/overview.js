define([
  'fco/controllers/conversion-module',
  'fco/controllers/realtime-module',
  'fco/controllers/volumetrics-module',
  'common/controllers/availability-module',
], function (conversionModule, realtimeModule,
             volumetricsModule, availabilityModule) {
  return function () {

    var serviceName = $("#wrapper").data("service-name");

    conversionModule(serviceName);
    realtimeModule(serviceName);
    volumetricsModule(serviceName);
    availabilityModule(serviceName, serviceName);
  };
});
