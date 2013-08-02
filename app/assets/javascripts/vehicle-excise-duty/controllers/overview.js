define([
  'common/controllers/availability-module',
], function (availabilityModule) {
  return function () {

    availabilityModule('tax-disc', '#tax-disc-availability');
    availabilityModule('register-sorn-statutory-off-road-notification', '#sorn-availability');
  };
});