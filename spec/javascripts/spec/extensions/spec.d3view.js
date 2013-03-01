define([
    'extensions/d3view',
    'd3',
    'extensions/collection'
],
function (D3View, d3, Collection) {
    describe("D3View", function() {
        it("keeps a reference to d3 library", function() {
            var view = new D3View();
            expect(view.d3).toBe(d3);
        });
    });
});
