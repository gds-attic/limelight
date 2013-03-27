define([
  'licensing/collections/totalandbyauthority',
  'licensing/collections/applications',
  'licensing/collections/byauthority',
  'extensions/collection'
],
function (TotalAndByAuthority, Total, ByAuthority, Collection) {
  describe("ApplicationsTotalAndByAuthorityCollection", function() {
    
    describe("initialize", function() {
      
      it("creates a 'meta' collection", function() {
        var totalAndByAuthority = new TotalAndByAuthority();
        expect(totalAndByAuthority.meta instanceof Collection).toBe(true);
        expect(totalAndByAuthority.meta.length).toEqual(0);
      });
      
      it("creates instances for the constituent collections", function() {
        var totalAndByAuthority = new TotalAndByAuthority();
        expect(totalAndByAuthority.collectionInstances[0] instanceof Total).toBe(true);
        expect(totalAndByAuthority.collectionInstances[1] instanceof ByAuthority).toBe(true);
      });
    });
    
    describe("parse", function() {
      
      var totalAndByAuthority, moment;
      beforeEach(function() {
        totalAndByAuthority = new TotalAndByAuthority();
        moment = totalAndByAuthority.moment;
        totalAndByAuthority.collectionInstances[0].reset([
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
        ]);
        totalAndByAuthority.collectionInstances[1].reset([
          {
            _start_at: moment('2013-02-18T00:00:00+00:00'),
            _end_at: moment('2013-02-25T00:00:00+00:00'),
            authorityUrlSlug: {
              westminster: { _count: 1 },
              croydon:     { _count: 2 },
              wandsworth:  { _count: 3 },
              lambeth:     { _count: 4 },
              bristol:     { _count: 5 }
            }
          },
          {
            _start_at: moment('2013-02-25T00:00:00+00:00'),
            _end_at: moment('2013-03-04T00:00:00+00:00'),
            authorityUrlSlug: {
              westminster: { _count:  6 },
              croydon:     { _count:  7 },
              wandsworth:  { _count:  8 },
              lambeth:     { _count:  9 },
              bristol:     { _count: 10 }
            }
          },
          {
            _start_at: moment('2013-03-04T00:00:00+00:00'),
            _end_at: moment('2013-03-11T00:00:00+00:00'),
            authorityUrlSlug: {
              westminster: { _count: 11 },
              croydon:     { _count: 12 },
              wandsworth:  { _count: 13 },
              lambeth:     { _count: 14 },
              bristol:     { _count: 15 }
            }
          }
        ]);
      });
      
      it("populates the meta collection with additional data when available", function() {
        totalAndByAuthority.collectionInstances[1].reset([
          {
            _start_at: moment('2013-02-18T00:00:00+00:00'),
            _end_at: moment('2013-02-25T00:00:00+00:00'),
            authorityUrlSlug: {
              westminster: { _count: 1, authorityName: ['Westminster'], licenceName: ['Temporary events notice'] },
              croydon:     { _count: 2, authorityName: ['Croydon']    , licenceName: ['Temporary events notice'] },
              wandsworth:  { _count: 3, authorityName: ['Wandsworth'] , licenceName: ['Temporary events notice'] },
              lambeth:     { _count: 4, authorityName: ['Lambeth']    , licenceName: ['Temporary events notice'] },
              bristol:     { _count: 5, authorityName: ['Bristol']    , licenceName: ['Temporary events notice'] }
            }
          },
          {
            _start_at: moment('2013-02-25T00:00:00+00:00'),
            _end_at: moment('2013-03-04T00:00:00+00:00'),
            authorityUrlSlug: {
              westminster: { _count:  6, authorityName: ['Westminster'], licenceName: ['Temporary events notice'] },
              croydon:     { _count:  7, authorityName: ['Croydon']    , licenceName: ['Temporary events notice'] },
              wandsworth:  { _count:  8, authorityName: ['Wandsworth'] , licenceName: ['Temporary events notice'] },
              lambeth:     { _count:  9, authorityName: ['Lambeth']    , licenceName: ['Temporary events notice'] },
              bristol:     { _count: 10, authorityName: ['Bristol']    , licenceName: ['Temporary events notice'] }
            }
          },
          {
            _start_at: moment('2013-03-04T00:00:00+00:00'),
            _end_at: moment('2013-03-11T00:00:00+00:00'),
            authorityUrlSlug: {
              westminster: { _count: 11, authorityName: ['Westminster'], licenceName: ['Temporary events notice'] },
              croydon:     { _count: 12, authorityName: ['Croydon']    , licenceName: ['Temporary events notice'] },
              wandsworth:  { _count: 13, authorityName: ['Wandsworth'] , licenceName: ['Temporary events notice'] },
              lambeth:     { _count: 14, authorityName: ['Lambeth']    , licenceName: ['Temporary events notice'] },
              bristol:     { _count: 15, authorityName: ['Bristol']    , licenceName: ['Temporary events notice'] }
            }
          }
        ]);
        totalAndByAuthority.parse();
        expect(totalAndByAuthority.meta.length).toEqual(6);
        expect(totalAndByAuthority.meta.at(0).get('id')).toEqual('total');
        expect(totalAndByAuthority.meta.at(0).get('title')).toEqual('Total applications');
        var westminster = totalAndByAuthority.meta.find(function (metaModel) {
          return metaModel.get('id') == 'westminster';
        });
        expect(westminster.get('title')).toEqual('Westminster');
        expect(westminster.get('subTitle')).toEqual('Temporary events notice');
        var bristol = totalAndByAuthority.meta.find(function (metaModel) {
          return metaModel.get('id') == 'bristol';
        });
        expect(bristol.get('title')).toEqual('Bristol');
        expect(bristol.get('subTitle')).toEqual('Temporary events notice');
      });
      
      it("populates the meta collection with fallback data", function() {
        totalAndByAuthority.parse();
        expect(totalAndByAuthority.meta.length).toEqual(6);
        expect(totalAndByAuthority.meta.at(0).get('id')).toEqual('total');
        expect(totalAndByAuthority.meta.at(0).get('title')).toEqual('Total applications');
        var westminster = totalAndByAuthority.meta.find(function (metaModel) {
          return metaModel.get('id') == 'westminster';
        });
        expect(westminster.get('title')).toEqual('westminster');
        expect(westminster.get('subTitle')).toBeFalsy();
        var bristol = totalAndByAuthority.meta.find(function (metaModel) {
          return metaModel.get('id') == 'bristol';
        });
        expect(bristol.get('title')).toEqual('bristol');
        expect(bristol.get('subTitle')).toBeFalsy();
      });
      
      it("combines data from constituent collections", function() {
        var result = totalAndByAuthority.parse();
        expect(result.length).toEqual(3);
        expect(result[0]).toEqual({
          _start_at: moment('2013-02-18T00:00:00+00:00'),
          _end_at: moment('2013-02-25T00:00:00+00:00'),
          total:      90,
          westminster: 1,
          croydon:     2,
          wandsworth:  3,
          lambeth:     4,
          bristol:     5
        });
        expect(result[1]).toEqual({
          _start_at: moment('2013-02-25T00:00:00+00:00'),
          _end_at: moment('2013-03-04T00:00:00+00:00'),
          total:     100,
          westminster: 6,
          croydon:     7,
          wandsworth:  8,
          lambeth:     9,
          bristol:    10
        });
        expect(result[2]).toEqual({
          _start_at: moment('2013-03-04T00:00:00+00:00'),
          _end_at: moment('2013-03-11T00:00:00+00:00'),
          total:      110,
          westminster: 11,
          croydon:     12,
          wandsworth:  13,
          lambeth:     14,
          bristol:     15
        });
      });
    });
  });
});
