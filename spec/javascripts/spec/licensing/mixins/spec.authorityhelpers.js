define([
  'licensing/mixins/authorityhelpers'
],
function (AuthorityHelpersMixin) {
  describe("AuthorityHelpersMixin", function () {
    
    describe("getAuthorityShortName", function () {

      var shortName = AuthorityHelpersMixin.getAuthorityShortName;

      it("does not change names that have no redundant content", function () {
        var names = [
          "Cheshire East",
          "Belfast Health and Social Care trust",
          "Department of Agriculture and Rural Development",
          "Driver and Vehicle Licensing Agency",
          "Food Standards Agency",
          "Northern Health and Social Care Trust",
          "Northern Ireland Environment Agency",
          "Office for Standards in Education, Children's Services and Skills"
        ];

        _.each(names, function (name) {
          expect(shortName(name)).toEqual(name);
        });
      });

      it("strips 'Council' from name", function () {
        expect(shortName("Aberdeenshire Council")).toEqual('Aberdeenshire');
      });

      it("strips 'City Council' from name", function () {
        expect(shortName("Aberdeen City Council")).toEqual('Aberdeen');
      });

      it("strips 'County Council' from name", function () {
        expect(shortName("Cardiff County Council")).toEqual('Cardiff');
      });

      it("strips 'City and District Council' from name", function () {
        expect(shortName("Armagh City and District Council")).toEqual('Armagh');
      });

      it("strips 'District Council' from name", function () {
        expect(shortName("Arun District Council")).toEqual('Arun');
      });

      it("strips 'Borough Council' from name", function () {
        expect(shortName("Amber Valley Borough Council")).toEqual('Amber Valley');
      });

      it("strips 'County Borough Council' from name", function () {
        expect(shortName("Bridgend County Borough Council")).toEqual('Bridgend');
      });

      it("strips 'Metropolitan Borough Council' from name", function () {
        expect(shortName("Barnsley Metropolitan Borough Council")).toEqual('Barnsley');
      });

      it("strips 'City Metropolitan District Council' from name", function () {
        expect(shortName("Wakefield City Metropolitan District Council")).toEqual('Wakefield');
      });

      it("strips 'Borough Council of' from beginning of name", function () {
        expect(shortName("Borough Council of King's Lynn and West Norfolk")).toEqual("King's Lynn and West Norfolk");
      });

      it("strips 'City of' from beginning of name and 'Council' from end of name", function () {
        expect(shortName("City of Edinburgh Council")).toEqual("Edinburgh");
      });

      it("strips 'City and County of' from beginning of name", function () {
        expect(shortName("City and County of Swansea")).toEqual("Swansea");
      });

      it("does not strip 'City of' from 'City of London'", function () {
        expect(shortName("City of London")).toEqual("City of London");
      });

      it("strips 'London Borough of' from beginning of name", function () {
        expect(shortName("London Borough of Barking and Dagenham")).toEqual("Barking and Dagenham");
      });

      it("strips 'Royal Borough of' from beginning of name", function () {
        expect(shortName("Royal Borough of Kensington and Chelsea")).toEqual("Kensington and Chelsea");
      });

    });
  });});
