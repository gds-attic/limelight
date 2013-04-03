define([
  'licensing/collections/applications-totalandtop5authorities-weekly',
  'licensing/collections/applications-total-weekly',
  'licensing/collections/applications-top5authorities-weekly',
  'extensions/collection'
],
function (TotalAndByAuthority, Total, ByAuthority, Collection) {
  describe("ApplicationsTotalAndByAuthorityCollection", function() {
    
    describe("parse", function() {
      
      var totalAndByAuthority, moment;
      beforeEach(function() {
        totalAndByAuthority = new TotalAndByAuthority();
        moment = totalAndByAuthority.moment;
        var total = totalAndByAuthority.collectionInstances[0];
        var byAuthority = totalAndByAuthority.collectionInstances[1];
        total.reset([{
          id: 'total'
        }]);
        
        byAuthority.reset([
          {
            id: 'group1',
            values: [ { _count: 1 }]
          },
          {
            id: 'group2',
            values: [ { _count: 1 }]
          }
        ], { parse: true });
      });
      
      it("combines both data sources", function() {
        totalAndByAuthority.reset(totalAndByAuthority.parse());
        
        expect(totalAndByAuthority.length).toEqual(3);
        expect(totalAndByAuthority.at(0).get('id')).toEqual('total');
        expect(totalAndByAuthority.at(1).get('id')).toEqual('group1');
        expect(totalAndByAuthority.at(2).get('id')).toEqual('group2');
      });
    });
  });
});
