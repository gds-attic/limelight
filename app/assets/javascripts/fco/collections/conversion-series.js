define([
  'extensions/collections/conversioncollection'
], function(ConversionCollection) {
  var ApplicationsConversionCollection = ConversionCollection.extend({
    
    apiName: 'journey',

    queryId: 'applications-conversion',

    initialize: function (models, options) {
      this.serviceName = options.serviceName;
      this.steps = [];
      this.stepTitles = {};

      var steps = [{'id': 'start', 'title': 'Start'},
                   {'id': 'confirm', 'title': 'Confirm'},
                   {'id': 'done', 'title': 'Done'}];

      _.each(steps, function(step) {
        var slug = this.serviceName + ":" + step.id;
        this.steps.push(slug);
        this.stepTitles[slug] = step.title;
      }, this);

      ConversionCollection.prototype.initialize.apply(this, arguments);
    }
    
  });

  return ApplicationsConversionCollection;
});
