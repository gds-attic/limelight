define([
  'licensing/models/applicationstablerow'
],
function (Model) {
  describe("ApplicationsTableRowModel", function () {
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
      
      it("does not set authority name when neither name nor slug are available", function () {
        var response = {
          licenceName: ['Licence Name']
        };
        expect(Model.prototype.parse(response)).toEqual({
          licenceName: 'Licence Name'
        });
      });
      
      it("falls back to authority slug when name is not available", function () {
        var response = {
          licenceUrlSlug: 'licenceSlug',
          authorityUrlSlug: 'authoritySlug',
          authorityName: ['Authority Name']
        };
        expect(Model.prototype.parse(response)).toEqual({
          authorityUrlSlug: 'authoritySlug',
          authorityName: 'Authority Name',
          licenceUrlSlug: 'licenceSlug',
          licenceName: 'licenceSlug'
        });
      });
      
      it("does not set licence name when neither name nor slug are available", function () {
        var response = {
          authorityName: ['Authority Name']
        };
        expect(Model.prototype.parse(response)).toEqual({
          authorityName: 'Authority Name'
        });
      });
    });
  });
});
