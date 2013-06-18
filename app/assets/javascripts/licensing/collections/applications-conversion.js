define([
  'extensions/collections/conversioncollection'
], function(ConversionCollection) {
  var ApplicationsConversionCollection = ConversionCollection.extend({
    
    serviceName: 'licensing',
    apiName: 'journey',

    queryId: 'applications-conversion',

    steps: [
      'licensingUserJourney:downloadFormPage',
      'licensingUserJourney:submitApplicationPage',
      'licensingUserJourney:end'
    ],
    
    stepTitles: {
      'licensingUserJourney:downloadFormPage': 'Download form page',
      'licensingUserJourney:submitApplicationPage': 'Submit application page',
      'licensingUserJourney:end': 'Done page'
    },
    
    queryParams: function() {
      var query = ConversionCollection.prototype.queryParams.apply(this, arguments);
      query.filter_by = "dataType:licensing_overview_journey";
      return query;
    },
    
  });

  return ApplicationsConversionCollection;
});
