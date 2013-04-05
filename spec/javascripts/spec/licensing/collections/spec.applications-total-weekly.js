define([
  'licensing/collections/applications-total-weekly',
  'extensions/group'
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
    });
    
    describe("parse", function () {
      it("creates a single group", function () {
        var collection = new Collection();
        collection.reset(collection.parse({ data: [
          {
            _start_at: moment('2013-02-18T00:00:00+00:00'),
            _end_at: moment('2013-02-25T00:00:00+00:00'),
            _count: 90
          },
          {
            _start_at: moment('2013-02-25T00:00:00+00:00'),
            _end_at: moment('2013-03-04T00:00:00+00:00'),
            _count: 100
          },
          {
            _start_at: moment('2013-03-04T00:00:00+00:00'),
            _end_at: moment('2013-03-11T00:00:00+00:00'),
            _count: 110
          }
        ]}), { parse: true });
        expect(collection.length).toEqual(1);
        var group = collection.at(0);
        expect(group instanceof Group).toBe(true);
        expect(group.get('id')).toEqual('total');
        expect(group.get('title')).toEqual('Total applications');
        expect(group.get('values').length).toEqual(3);
        expect(group.get('values').at(0).get('_count')).toEqual(90);
        expect(group.get('values').at(0).get('_start_at').format('YYYY-MM-DD')).toEqual('2013-02-18');
      });
    });
  });
});
