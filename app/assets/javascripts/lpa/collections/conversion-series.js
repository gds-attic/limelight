define([
  'extensions/collections/conversioncollection'
], function (ConversionCollection) {
  var ConversionSeries = ConversionCollection.extend({

    serviceName:'lasting-power-of-attorney',
    apiName:'journey',

    queryId:'lpa-conversion',

    steps:[
      'step1',
      'step2',
      'step3',
      'step4',
      'step5',
      'step6',
      'step7',
      'step8',
      'step9',
      'step10'

    ],

    stepTitles:{
      'step1':'Step 1',
      'step2':'Step 2',
      'step3':'Step 3',
      'step4':'Step 4',
      'step5':'Step 5',
      'step6':'Step 6',
      'step7':'Step 7',
      'step8':'Step 8',
      'step9':'Step 9',
      'step10':'Step 10'
    },

    getStep: function(d) {
      return d.eventLabel;
    }
  });

  return ConversionSeries;
});