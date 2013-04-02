define([
    'extensions/collection',
    'extensions/model',
    'backbone'
],
function (Collection, Model, Backbone) {
    describe("Collection", function() {
        it("inherits from Backbone.Collection", function() {
            var collection = new Collection();
            expect(collection instanceof Backbone.Collection).toBe(true);
        });
        
        it("sets the extended Model as default model", function() {
            var collection = new Collection([{foo: 'bar'}]);
            expect(collection.models[0] instanceof Model).toBe(true);
        });
        
        describe("prop", function() {
          it("retrieves an object property", function() {
            var collection = new Collection();
            collection.testProp = { foo: 'bar' };
            expect(collection.prop('testProp')).toEqual({ foo: 'bar' });
          });
          
          it("retrieves an object method result", function() {
            var collection = new Collection();
            collection.otherProp = { foo: 'bar' };
            collection.testProp = function () {
              return this.otherProp;
            };
            expect(collection.prop('testProp')).toEqual({ foo: 'bar' });
          });
          
          it("retrieves property from another object", function() {
            var collection = new Collection();
            var anotherObject = {
              testProp: { foo: 'bar' }
            };
            expect(collection.prop('testProp', anotherObject)).toEqual({ foo: 'bar' });
          });
          
          it("retrieves method result from another object", function() {
            var collection = new Collection();
            var anotherObject = {
              otherProp: { foo: 'bar' },
              testProp: function () {
                return this.otherProp;
              }
            };
            expect(collection.prop('testProp', anotherObject)).toEqual({ foo: 'bar' });
          });
        });
        
        describe("url", function() {
          
          var TestCollection;
          beforeEach(function() {
            TestCollection = Collection.extend({
              baseUrl: '//testdomain/',
              queryUrl: 'bucketname'
            });
          });
          
          it("constructs a backdrop query URL without params", function() {
            var collection = new TestCollection();
            expect(collection.url()).toEqual('//testdomain/performance/bucketname/api?');
          });
          
          it("constructs a backdrop query URL with static params", function() {
            var collection = new TestCollection();
            collection.queryParams = {
              a: 1,
              b: 'foo bar'
            }
            expect(collection.url()).toEqual('//testdomain/performance/bucketname/api?a=1&b=foo+bar');
          });
          
          it("constructs a backdrop query URL with multiple values for a single parameter", function() {
            var collection = new TestCollection();
            collection.queryParams = {
              a: [1, 'foo']
            }
            expect(collection.url()).toEqual('//testdomain/performance/bucketname/api?a=1&a=foo');
          });
          
          it("constructs a backdrop query URL with dynamic params", function() {
            var collection = new TestCollection();
            collection.testProp = 'foo bar';
            collection.queryParams = function () {
              return {
                a: 1,
                b: this.testProp
              };
            };
            expect(collection.url()).toEqual('//testdomain/performance/bucketname/api?a=1&b=foo+bar');
          });
          
          it("constructs a backdrop query URL with moment date params", function() {
            var collection = new TestCollection();
            collection.testProp = 'foo bar';
            collection.queryParams = function () {
              return {
                a: 1,
                somedate: this.moment('03/08/2013 14:53:26 +00:00', 'MM/DD/YYYY HH:mm:ss T')
              };
            };
            expect(collection.url()).toEqual('//testdomain/performance/bucketname/api?a=1&somedate=2013-03-08T14%3A53%3A26%2B00%3A00');
          });
        });
    });
});
