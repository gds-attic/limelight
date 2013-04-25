define([
  'licensing/models/authority'
],
function (Model) {
  describe("Authority", function () {
    
    describe("parse", function () {
      
      beforeEach(function() {
        spyOn(Model.prototype, "getAuthoritySortName").andReturn('sort name');
      });
      
      it("uses authority name when available and calculates an authority name for sorting", function () {
        var response = {
          authorityUrlSlug: 'authoritySlug',
          authorityName: ['Authority Name']
        };
        var parsed = Model.prototype.parse(response);
        expect(parsed.slug).toEqual('authoritySlug');
        expect(parsed.name).toEqual('Authority Name');
        expect(parsed.sortName).toEqual('sort name');
        expect(Model.prototype.getAuthoritySortName).toHaveBeenCalledWith('Authority Name');
      });
      
      it("falls back to authority slug when name is not available", function () {
        var response = {
          authorityUrlSlug: 'authoritySlug'
        };
        var parsed = Model.prototype.parse(response);
        expect(parsed.slug).toEqual('authoritySlug');
        expect(parsed.name).toEqual('authoritySlug');
        expect(parsed.sortName).toEqual('sort name');
      });
    });
    
  });
});
