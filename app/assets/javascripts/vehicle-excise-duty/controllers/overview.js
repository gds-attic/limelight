define([
  'require',
  './failures-module',
  'common/controllers/availability-module'
], function (require, failuresModule, availabilityModule) {
  return function () {
    
    failuresModule('#tax-disc-failures', 'tax-disc');
    failuresModule('#sorn-failures', 'sorn');

    availabilityModule('tax-disc', '#tax-disc-availability');
    availabilityModule('register-sorn-statutory-off-road-notification', '#sorn-availability');
  };
});