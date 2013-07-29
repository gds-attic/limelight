define([
  'extensions/collections/conversioncollection'
], function (ConversionCollection) {
  var ConversionSeries = ConversionCollection.extend({

    serviceName:'lasting-power-of-attorney',
    apiName:'journey',

    queryId:'lpa-conversion',

    steps:[
      'user/register',
      'user/login',
      'user/dashboard',
      'create/lpa-type',
      'create/donor',
      'create/attorneys',
      'create/people-to-be-told',
      'create/review',
      'create/complete',
      'register'

    ],

    stepTitles:{
      'user/register':'Register user',
      'user/login':'Login',
      'user/dashboard':'Dashboard',
      'create/lpa-type':'Choose LPA Type',
      'create/donor':'Add donor details',
      'create/attorneys':'Create attorneys',
      'create/people-to-be-told':'People to be told',
      'create/review':'Review',
      'create/complete':'Complete',
      'register':'Register LPA'
    },

    getStep: function(d) {
      return d.eventLabel;
    }
  });

  return ConversionSeries;
});