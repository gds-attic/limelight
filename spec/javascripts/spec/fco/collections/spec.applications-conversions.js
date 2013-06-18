define([
  'fco/collections/conversion-series'
], function(Collection) {
  describe('ApplicationsConversion', function() {
    describe('url', function() {
      it("should get the service name from options", function() {
        var collection = new Collection([], {serviceName: 'my-example'});

        expect(collection.serviceName).toEqual('my-example');
      });

      it("should generate steps and stepTitles correctly", function() {
        var collection = new Collection([], {serviceName: 'my-example'});

        expect(collection.steps).toEqual(['my-example:start', 'my-example:confirm', 'my-example:done'])
        expect(collection.stepTitles).toEqual({
          'my-example:start': 'Start',
          'my-example:confirm': 'Confirm',
          'my-example:done': 'Done'
        })
      });
    });
  });
});