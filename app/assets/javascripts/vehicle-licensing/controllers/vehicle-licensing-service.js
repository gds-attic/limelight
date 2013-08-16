define([
  'require',
  './failures-module',
  'common/controllers/availability-module'
], function (require, failuresModule, availabilityModule) {

  return function () {
    var service = $('#wrapper').data('service-name'),
        serviceNames = {
          'sorn': 'register-sorn-statutory-off-road-notification',
          'tax-disc': 'tax-disc'
        };

    failuresModule('#' + service + '-failures', service);

    availabilityModule(serviceNames[service], '#' + service + '-availability');
  };
});
