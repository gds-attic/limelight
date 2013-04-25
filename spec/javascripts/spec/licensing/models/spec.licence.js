define([
  'licensing/models/licence'
],
function (Model) {
  describe("Licence", function () {
    
    describe("parse", function () {
      
      it("uses licence name when available", function () {
        var response = {
          licenceUrlSlug: 'licenceSlug',
          licenceName: ['Licence Name']
        };
        var parsed = Model.prototype.parse(response);
        expect(parsed.slug).toEqual('licenceSlug');
        expect(parsed.name).toEqual('Licence Name');
        expect(parsed.sortName).toEqual('Licence Name');
      });
      
      it("falls back to licence slug when name is not available", function () {
        var response = {
          licenceUrlSlug: 'licenceSlug'
        };
        var parsed = Model.prototype.parse(response);
        expect(parsed.slug).toEqual('licenceSlug');
        expect(parsed.name).toEqual('licenceSlug');
        expect(parsed.sortName).toEqual('licenceSlug');
      });
    });
  });
});
