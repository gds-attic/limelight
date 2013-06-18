define([
  'extensions/collections/conversioncollection'
], function(Collection) {
  describe("ConversionSeriesCollection", function() {
    var TestCollection;
    beforeEach(function() {
      TestCollection = Collection.extend({
        steps: ['example:downloadFormPage',
                'example:submitApplicationPage',
                'example:end'],
        stepTitles: {
          'example:downloadFormPage': 'A',
          'example:submitApplicationPage': 'B',
          'example:end': 'C'
        }});
    });
    describe("queryParams", function() {
      
      it("requests data for the last week by default", function() { 
        var collection = new TestCollection();
        
        setupMoment('2013-03-13', collection);
      
        var params = collection.queryParams();
        expect(params.start_at.format('YYYY-MM-DDTHH:mm:ss')).toEqual('2013-03-04T00:00:00');
        expect(params.end_at.format('YYYY-MM-DDTHH:mm:ss')).toEqual('2013-03-11T00:00:00');
      });
      
      it("requests data for an earlier week", function() { 
        var collection = new TestCollection(null, {
          weeksAgo: 1
        });
        
        setupMoment('2013-03-13', collection);
      
        var params = collection.queryParams();
        expect(params.start_at.format('YYYY-MM-DDTHH:mm:ss')).toEqual('2013-02-25T00:00:00');
        expect(params.end_at.format('YYYY-MM-DDTHH:mm:ss')).toEqual('2013-03-04T00:00:00');
      });
    });
    
    describe("Sorting", function() {
      it("should not change order if they follow the specified sort order", function() {
        var models = [
          {eventCategory: "example:downloadFormPage", uniqueEvents: 54321},
          {eventCategory: "example:submitApplicationPage", uniqueEvents: 4321},
          {eventCategory: "example:end", uniqueEvents: 321}
        ];
        var collection = new TestCollection(models, {});

        expect(collection.at(0).get('eventCategory')).toEqual("example:downloadFormPage");
        expect(collection.at(1).get('eventCategory')).toEqual("example:submitApplicationPage");
        expect(collection.at(2).get('eventCategory')).toEqual("example:end");
      });

      it("should reorder according to a provided sort order", function() {
        var models = [
          {eventCategory: "example:submitApplicationPage", uniqueEvents: 4321},
          {eventCategory: "example:downloadFormPage", uniqueEvents: 54321},
          {eventCategory: "example:end", uniqueEvents: 321}
        ];
        var collection = new TestCollection(models, {});

        expect(collection.at(0).get('eventCategory')).toEqual("example:downloadFormPage");
        expect(collection.at(1).get('eventCategory')).toEqual("example:submitApplicationPage");
        expect(collection.at(2).get('eventCategory')).toEqual("example:end");
      });

      it("should not include unrecognised keys", function() {
        var models = [
          {eventCategory: "afly_1", uniqueEvents: 4321},
          {eventCategory: "example:downloadFormPage", uniqueEvents: 54321},
          {eventCategory: "example:submitApplicationPage", uniqueEvents: 321},
          {eventCategory: "example:end", uniqueEvents: 3211}
        ];
        var collection = new TestCollection();
        collection.reset(collection.parse({ data: models }));

        expect(collection.length).toEqual(3);
        expect(collection.at(0).get('eventCategory')).toEqual("example:downloadFormPage");
        expect(collection.at(1).get('eventCategory')).toEqual("example:submitApplicationPage");
        expect(collection.at(2).get('eventCategory')).toEqual("example:end");
      });

    });
    
    describe("parse", function () {
      it("adds a normalised fraction of unique events for each step", function () {
        var models = [
          {eventCategory: "example:downloadFormPage", uniqueEvents: 50000},
          {eventCategory: "example:submitApplicationPage", uniqueEvents: 25000},
          {eventCategory: "example:end", uniqueEvents: 10000}
        ];
        var collection = new TestCollection();
        collection.reset(collection.parse({ data: models }));

        expect(collection.at(0).get('eventCategory')).toEqual("example:downloadFormPage");
        expect(collection.at(0).get('uniqueEventsNormalised')).toEqual(1);
        expect(collection.at(1).get('eventCategory')).toEqual("example:submitApplicationPage");
        expect(collection.at(1).get('uniqueEventsNormalised')).toEqual(0.5);
        expect(collection.at(2).get('eventCategory')).toEqual("example:end");
        expect(collection.at(2).get('uniqueEventsNormalised')).toEqual(0.2);
      });

      it("deals with missing steps in the response", function () {
        var models = [];
        var collection = new TestCollection();
        collection.reset(collection.parse({ data: models }));

        expect(collection.length).toEqual(3);
        expect(collection.at(0).get('eventCategory')).toEqual("example:downloadFormPage");
        expect(collection.at(0).get('uniqueEvents')).toEqual(0);
        expect(collection.at(0).get('uniqueEventsNormalised')).toEqual(0);
        expect(collection.at(1).get('eventCategory')).toEqual("example:submitApplicationPage");
        expect(collection.at(1).get('uniqueEvents')).toEqual(0);
        expect(collection.at(1).get('uniqueEventsNormalised')).toEqual(0);
        expect(collection.at(2).get('eventCategory')).toEqual("example:end");
        expect(collection.at(2).get('uniqueEvents')).toEqual(0);
        expect(collection.at(2).get('uniqueEventsNormalised')).toEqual(0);
      });
    });
  });
});