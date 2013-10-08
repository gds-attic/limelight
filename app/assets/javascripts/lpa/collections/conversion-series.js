define([
  'extensions/collections/conversioncollection'
], function (ConversionCollection) {
  var ConversionSeries = ConversionCollection.extend({

    serviceName:'lasting-power-of-attorney',
    apiName:'journey',

    queryId:'lpa-conversion',

    steps:[
      'user/login',
      'create/lpa-type',
      'create/donor',
      'create/attorneys',
      'create/certificate-provider',
      'create/review',
      'create/complete'
    ],

    stepTitles:{
      'user/login':'Login',
      'create/lpa-type':'Choose LPA type',
      'create/donor':'Add donor details',
      'create/attorneys':'Create attorneys',
      'create/certificate-provider':'Choose certificate provider',
      'create/review':'Review LPA',
      'create/complete':'LPA PDF complete'
    },

    getStep: function(d) {
      return d.eventLabel;
    }
  });

  return ConversionSeries;
});
