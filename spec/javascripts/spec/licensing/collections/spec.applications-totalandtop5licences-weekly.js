define([
  'licensing/collections/applications-totalandtop5licences-weekly',
  'licensing/collections/applications-total-weekly',
  'licensing/collections/applications-top5licences-weekly',
  'extensions/collections/collection'
],
function (TotalAndByLicence, Total, ByLicence, Collection) {
  describe("ApplicationsTotalAndByLicenceCollection", function() {
    
    describe("parse", function() {
      
      var totalAndByLicence, moment;
      beforeEach(function() {
        totalAndByLicence = new TotalAndByLicence();
        
        moment = totalAndByLicence.moment;
        var total = totalAndByLicence.collectionInstances[0];
        var byLicence = totalAndByLicence.collectionInstances[1];
        total.reset([{
          id: 'total'
        }]);
        
        byLicence.reset([
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
        totalAndByLicence.reset(totalAndByLicence.parse());
        
        expect(totalAndByLicence.length).toEqual(3);
        expect(totalAndByLicence.at(0).get('id')).toEqual('total');
        expect(totalAndByLicence.at(1).get('id')).toEqual('group1');
        expect(totalAndByLicence.at(2).get('id')).toEqual('group2');
      });
    });
  });
});
