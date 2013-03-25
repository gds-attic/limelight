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
    
    getQueryForResponse: function (query) {
      var responseQuery = {};
      _.each(query, function (value, key) {
        if (key == 'filter_by') {
          if (responseQuery.filter_by == null) {
            // first filter param, assign as single value
            responseQuery.filter_by = value;
          } else if (_.isArray(responseQuery.filter_by)) {
            // filter already is an array, add another filter
            responseQuery.filter_by.push(value);
          } else {
            // second filter param, convert to array
            responseQuery.filter_by = [responseQuery.filter_by, value];
          }
        } else if (moment.isMoment(value) && value.originalValue) {
          // for date params, use original query string, not moment object
          responseQuery[key] = value.originalValue;
        } else if (key == 'collect') {
          responseQuery[key] = value.split(',');
        } else {
          responseQuery[key] = value;
        }
      });
      return responseQuery;
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
                var originalValue = value;
                value = moment(value, that.dateFormat);
                value.originalValue = originalValue;
              }
              query[key] = value;
            }
        );

        // generate response
        this.responseText = {
          query: that.getQueryForResponse(query),
          data: that.getData(query)
        };
      }
    }
  });
  
  Response.extend = Backbone.Model.extend;
  
  return Response;
});
