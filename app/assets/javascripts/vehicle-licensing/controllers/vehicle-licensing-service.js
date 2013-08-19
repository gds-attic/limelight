define([
  'require',
  './failures-module',
  'common/controllers/availability-module',
  './vehicle-license-volumes-module'
], function (require, failuresModule, availabilityModule, volumesModule) {

  return function () {
    var service = $('#wrapper').data('service-name'),
        serviceNames = {
          'sorn': 'register-sorn-statutory-off-road-notification',
          'tax-disc': 'tax-disc'
        };

    volumesModule('#' + service + '-volumes', 'successful_' + service.replace("-", "_"), service);

    failuresModule('#' + service + '-failures', service);

    availabilityModule(serviceNames[service], '#' + service + '-availability');
  };
});
