define([
  'licensing/models/entity'
],
function (Model) {
  describe("Entity", function () {
    
    describe("parse", function () {
      
      beforeEach(function() {
        spyOn(Model.prototype, "getAuthoritySortName").andReturn('sort name');
      });
      
      it("uses authority name and licence name when available and calculates an authority name for sorting", function () {
        var response = {
          authorityUrlSlug: 'authoritySlug',
          authorityName: ['Authority Name'],
          licenceUrlSlug: 'licenceSlug',
          licenceName: ['Licence Name']
        };
        expect(Model.prototype.parse(response)).toEqual({
          authorityUrlSlug: 'authoritySlug',
          authorityName: 'Authority Name',
          authoritySortName: 'sort name',
          licenceUrlSlug: 'licenceSlug',
          licenceName: 'Licence Name'
        });
        expect(Model.prototype.getAuthoritySortName).toHaveBeenCalledWith('Authority Name');
      });
      
      it("falls back to authority slug when name is not available", function () {
        var response = {
          authorityUrlSlug: 'authoritySlug',
          licenceUrlSlug: 'licenceSlug',
          licenceName: ['Licence Name']
        };
        expect(Model.prototype.parse(response)).toEqual({
          authorityUrlSlug: 'authoritySlug',
          authorityName: 'authoritySlug',
          authoritySortName: 'sort name',
          licenceUrlSlug: 'licenceSlug',
          licenceName: 'Licence Name'
        });
      });
      
      it("does not set authority name when neither name nor slug are available", function () {
        var response = {
          licenceUrlSlug: 'licenceSlug',
          licenceName: ['Licence Name']
        };
        expect(Model.prototype.parse(response)).toEqual({
          licenceUrlSlug: 'licenceSlug',
          licenceName: 'Licence Name'
        });
      });
      
      it("falls back to licence slug when name is not available", function () {
        var response = {
          licenceUrlSlug: 'licenceSlug',
          authorityUrlSlug: 'authoritySlug'
        };
        expect(Model.prototype.parse(response)).toEqual({
          authorityUrlSlug: 'authoritySlug',
          authorityName: 'authoritySlug',
          authoritySortName: 'sort name',
          licenceUrlSlug: 'licenceSlug',
          licenceName: 'licenceSlug'
        });
      });
      
      it("does not set licence name when neither name nor slug are available", function () {
        var response = {
          authorityUrlSlug: 'authoritySlug'
        };
        expect(Model.prototype.parse(response)).toEqual({
          authorityUrlSlug: 'authoritySlug',
          authorityName: 'authoritySlug',
          authoritySortName: 'sort name'
        });
      });
    });
    
  });
});
