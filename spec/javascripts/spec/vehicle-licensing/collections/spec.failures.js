define([
  'vehicle-licensing/collections/failures',
  'extensions/collections/collection'
],
function (Failures, Collection) {
  describe("Vehicle Excise Duty Failures Collection", function () {

    describe("parse", function () {

      it("parses grouped response", function () {

        var weeks = [
          new Collection([
            {"count":2, "reason":0, "description":"Reason A"},
            {"count":4, "reason":2, "description":"Only happened last week"},
            {"count":10, "reason":5, "description":"Reason B"}
          ], { parse: true }),
          new Collection([
            {"count":1, "reason":0, "description":"Reason A"},
            {"count":123, "reason":3, "description":"Only happened previous week"},
            {"count":10, "reason":5, "description":"Reason B"}
          ], { parse: true })
        ];

        var failures = new Failures();
        failures.collectionInstances = weeks;
        failures.reset(failures.parse(), { parse: true });

        expect(failures.length).toEqual(3);
        expect(failures.at(0).get('count')).toEqual(2);
        expect(failures.at(0).get('change')).toEqual(1);
        expect(failures.at(0).get('fraction')).toEqual(0.125);
        expect(failures.at(1).get('count')).toEqual(4);
        expect(failures.at(1).get('change')).toBe(null);
        expect(failures.at(1).get('fraction')).toEqual(0.25);
      });
    });
  });
});
