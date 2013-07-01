define([
  'extensions/models/query'
],
function (Query) {
  describe("Query", function () {
    describe("set", function () {
      
      beforeEach(function() {
        setupMoment('2013-05-15 06:15:45', Query.prototype);
      });
      
      it("sets start and end date for 'month' period using constructor", function () {
        var query = new Query({
          foo: 'bar',
          period: 'month'
        });
        expect(query.get('foo')).toEqual('bar');
        expect(query.get('period')).toEqual('month');
        expect(query.get('end_at').format('YYYY-MM-DD')).toEqual('2013-05-01');
        expect(query.get('start_at').format('YYYY-MM-DD')).toEqual('2012-05-01');
      });
      
      it("sets start and end date for 'month' period using object syntax", function () {
        var query = new Query({
          a: 'b'
        });
        query.set({
          foo: 'bar',
          period: 'month'
        })
        expect(query.get('a')).toEqual('b');
        expect(query.get('foo')).toEqual('bar');
        expect(query.get('period')).toEqual('month');
        expect(query.get('end_at').format('YYYY-MM-DD')).toEqual('2013-05-01');
        expect(query.get('start_at').format('YYYY-MM-DD')).toEqual('2012-05-01');
      });
      
      it("sets start and end date for 'month' period using key, value syntax", function () {
        var query = new Query({
          foo: 'bar'
        });
        query.set('period', 'month');
        expect(query.get('foo')).toEqual('bar');
        expect(query.get('period')).toEqual('month');
        expect(query.get('end_at').format('YYYY-MM-DD')).toEqual('2013-05-01');
        expect(query.get('start_at').format('YYYY-MM-DD')).toEqual('2012-05-01');
      });
      
      it("sets start and end date for 'week' period", function () {
        var query = new Query({ period: 'week' });
        expect(query.get('period')).toEqual('week');
        expect(query.get('end_at').format('YYYY-MM-DD')).toEqual('2013-05-13');
        expect(query.get('start_at').format('YYYY-MM-DD')).toEqual('2013-03-11');
      });
      
      it("ignores unknown periods using constructor", function () {
        var query = new Query({
          foo: 'bar',
          period: 'unknown'
        });
        expect(query.get('foo')).toEqual('bar');
        expect(query.get('period')).toEqual('unknown');
        expect(query.get('end_at')).not.toBeDefined()
        expect(query.get('start_at')).not.toBeDefined()
      });
      
      it("ignores unknown periods using object syntax", function () {
        var query = new Query({
          foo: 'bar'
        });
        query.set({
          period: 'unknown'
        });
        expect(query.get('foo')).toEqual('bar');
        expect(query.get('period')).toEqual('unknown');
        expect(query.get('end_at')).not.toBeDefined()
        expect(query.get('start_at')).not.toBeDefined()
      });
      
      it("ignores unknown periods using key, value syntax", function () {
        var query = new Query({
          foo: 'bar'
        });
        query.set('period', 'unknown');
        expect(query.get('foo')).toEqual('bar');
        expect(query.get('period')).toEqual('unknown');
        expect(query.get('end_at')).not.toBeDefined()
        expect(query.get('start_at')).not.toBeDefined()
      });
      
    });

    describe("timezone handling", function() {

      beforeEach(function() {
        setupMoment('2013-05-15 06:15:45 +0100', Query.prototype);
      });

      it("should generate start_at and end_at as UTC", function() {
        var query = new Query();
        var attributes = {
          period: 'week'
        };
        query.set(attributes);
        expect(query.get('end_at')).toBeMoment(moment('2013-05-13T00:00:00+00:00'));
        expect(query.get('start_at')).toBeMoment(moment('2013-03-11T00:00:00+00:00'));
      });

      it("should generate start_at and end_at as GB timezone when configured to do so", function() {
        var query = new Query();
        var attributes = {
            period: 'week'
        };
        var options = { utc: false }
        query.set(attributes, options);
        expect(query.get('end_at')).toBeMoment(moment('2013-05-13T00:00:00+01:00'));
        expect(query.get('start_at')).toBeMoment(moment('2013-03-11T00:00:00+00:00')); // no DST on this date
      });

    });
    
  });
});
