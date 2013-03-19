define([
  'lodash',
  'backbone',
  'moment'
],
function (_, Backbone, moment) {
  var Response = function () {
    this.initialize.apply(this, arguments);
  };
  
  _.extend(Response.prototype, {
    
    initialize: function () {},
    
    dataType: 'json',
    
    urlParams: ['query'],
    
    dateParams: ['start_at', 'end_at'],
    dateFormat: 'YYYY-MM-DDTHH:mm:ssTZ',
    
    getData: function () {
      throw('Not implemented.');
    },
    
    getDefinition: function () {
      return {
        dataType: this.dataType,
        url: this.url,
        urlParams: this.urlParams,
        response: this.getResponse()
      };
    },
    
    getResponse: function () {
      
      // use closure as the response function needs to be executed with
      // mockjax as context and cannot be bound to the response object
      var that = this;
      
      return function(settings) {
        // extract query parameters, convert to moment dates
        var query = {};
        settings.urlParams.query.replace(
            /([^?=&]+)(?:=([^&]*))?/g,
            function (all, key, value) {
              value = decodeURIComponent(value);
              if (_.contains(that.dateParams, key)) {
                value = moment(value, that.dateFormat);
              }
              query[key] = value;
            }
        );

        // generate response
        this.responseText = {
          data: that.getData(query)
        };
      }
    }
  });
  
  Response.extend = Backbone.Model.extend;
  
  return Response;
});
