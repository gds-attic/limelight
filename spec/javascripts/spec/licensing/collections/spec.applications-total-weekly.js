define([
  'licensing/collections/applications-total-weekly',
  'extensions/models/group'
],
function (Collection, Group) {
  describe("ApplicationsCollection", function() {
    describe("queryParams", function() {
      
      it("requests data for the last nine weeks", function() {
        var collection = new Collection();
        
        setupMoment('2013-03-13', collection);
      
        var params = collection.queryParams();
        expect(params.start_at.format('YYYY-MM-DDTHH:mm:ss')).toEqual('2013-01-07T00:00:00');
        expect(params.end_at.format('YYYY-MM-DDTHH:mm:ss')).toEqual('2013-03-11T00:00:00');
        expect(params.period).toEqual('week');
      });

      it("requests data for the last nine weeks", function () {
            var collection = new Collection();

            setupMoment('2013-03-13 06:15:32', collection);

            var params = collection.queryParams();
            expect(params.start_at.format('YYYY-MM-DDTHH:mm:ss')).toEqual('2013-01-07T00:00:00');
            expect(params.end_at.format('YYYY-MM-DDTHH:mm:ss')).toEqual('2013-03-11T00:00:00');
            expect(params.period).toEqual('week');
      });

      it("requests date for a month during BST time", function() {
        var collection = new Collection();

        setupMoment('2013-07-13 06:45:00', collection);

        var params = collection.queryParams();
        expect(params.start_at.format('YYYY-MM-DDTHH:mm:ssZZ')).toEqual('2013-05-06T00:00:00+0000');
        expect(params.end_at.format('YYYY-MM-DDTHH:mm:ssZZ')).toEqual('2013-07-08T00:00:00+0000');
      });
    });
  });
});
