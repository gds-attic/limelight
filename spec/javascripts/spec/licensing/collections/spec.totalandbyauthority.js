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
              westminster: { _count: 1, authorityName: ['Westminster'] },
              croydon:     { _count: 2, authorityName: ['Croydon']     },
              wandsworth:  { _count: 3, authorityName: ['Wandsworth']  },
              lambeth:     { _count: 4, authorityName: ['Lambeth']     },
              bristol:     { _count: 5, authorityName: ['Bristol']     }
            }
          },
          {
            _start_at: moment('2013-02-25T00:00:00+00:00'),
            _end_at: moment('2013-03-04T00:00:00+00:00'),
            authorityUrlSlug: {
              westminster: { _count:  6, authorityName: ['Westminster'] },
              croydon:     { _count:  7, authorityName: ['Croydon']     },
              wandsworth:  { _count:  8, authorityName: ['Wandsworth']  },
              lambeth:     { _count:  9, authorityName: ['Lambeth']     },
              bristol:     { _count: 10, authorityName: ['Bristol']     }
            }
          },
          {
            _start_at: moment('2013-03-04T00:00:00+00:00'),
            _end_at: moment('2013-03-11T00:00:00+00:00'),
            authorityUrlSlug: {
              westminster: { _count: 11, authorityName: ['Westminster'] },
              croydon:     { _count: 12, authorityName: ['Croydon']     },
              wandsworth:  { _count: 13, authorityName: ['Wandsworth']  },
              lambeth:     { _count: 14, authorityName: ['Lambeth']     },
              bristol:     { _count: 15, authorityName: ['Bristol']     }
            }
          }
        ]);
      });
      
      it("populates the meta collection", function() {
        totalAndByAuthority.parse();
        expect(totalAndByAuthority.meta.length).toEqual(6);
        expect(totalAndByAuthority.meta.at(0).get('id')).toEqual('total');
        expect(totalAndByAuthority.meta.at(0).get('title')).toEqual('Total');
        expect(totalAndByAuthority.meta.find(function (metaModel) {
          return metaModel.get('id') == 'westminster';
        }).get('title')).toEqual('Westminster');
        expect(totalAndByAuthority.meta.find(function (metaModel) {
          return metaModel.get('id') == 'bristol';
        }).get('title')).toEqual('Bristol');
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
