define([
    'extensions/model',
    'backbone'
],
function (Model, Backbone) {
    describe("Model", function() {
        it("inherits from Backbone.Model", function() {
            var model = new Model();
            expect(model instanceof Backbone.Model).toBe(true);
        });

        it("defines a custom property", function() {
            var model = new Model();
            expect(model.customProperty).toBe(true);
        });
        
        describe("parse", function() {
            
            it("converts valid timestamps into moment date objects", function() {
                var model = new Model({
                    foo: 'bar',
                    '_timestamp': '2013-01-01'
                }, {
                    parse: true
                });
                
                expect(moment.isMoment(model.get('_timestamp'))).toBe(true);
                expect(model.get('_timestamp').format('YYYY-MM-DD')).toEqual('2013-01-01');
            });
            
            it("warns when a timestamp is invalid", function() {
                spyOn(window.console, "warn");
                var model = new Model({
                    foo: 'bar',
                    '_timestamp': 'asdf'
                }, {
                    parse: true
                });
                
                expect(moment.isMoment(model.get('_timestamp'))).toBe(false);
                expect(console.warn).toHaveBeenCalled();
            });
            
        });
    });
});
