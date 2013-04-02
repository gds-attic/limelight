define([
  'licensing/models/perlicencetablerow'
],
function (Model) {
  describe("PerLicenceTableCollectionRowModel", function () {
    describe("parse", function () {
      it("uses authority name and licence name when available", function () {
        var response = {
          authorityUrlSlug: 'authoritySlug',
          authorityName: ['Authority Name'],
          licenceName: ['Licence Name']
        };
        expect(Model.prototype.parse(response)).toEqual({
          authorityUrlSlug: 'authoritySlug',
          authorityName: 'Authority Name',
          licenceName: 'Licence Name'
        });
      });
      
      it("falls back to authority slug when name is not available", function () {
        var response = {
          authorityUrlSlug: 'authoritySlug',
          licenceName: ['Licence Name']
        };
        expect(Model.prototype.parse(response)).toEqual({
          authorityUrlSlug: 'authoritySlug',
          authorityName: 'authoritySlug',
          licenceName: 'Licence Name'
        });
      });
      
      it("does not set licence name when not available", function () {
        var response = {
          authorityUrlSlug: 'authoritySlug'
        };
        expect(Model.prototype.parse(response)).toEqual({
          authorityUrlSlug: 'authoritySlug',
          authorityName: 'authoritySlug',
        });
      });
    });
  });
});
