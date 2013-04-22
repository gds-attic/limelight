define([
  'extensions/collections/collection',
  'extensions/models/model',
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
    
    describe("fetch", function () {
      var TestCollection;
      beforeEach(function() {
        TestCollection = Collection.extend({
          baseUrl: '//testdomain/',
          queryUrl: 'bucketname',
          queryId: 'testid'
        });
        spyOn(TestCollection.prototype, "sync");
      });

      it("adds a unique identifier to the request", function () {
        var collection = new TestCollection();
        collection.fetch();
        expect(collection.sync.argsForCall[0][2].queryId).toEqual('testid');
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
      
      it("constructs a backdrop query URL with a single filter parameter", function () {
        var collection = new TestCollection([], {
          filterBy: {
            foo: 'bar'
          }
        });
        collection.queryParams = function () {
          return {
            a: 1
          };
        };
        var url = collection.url()
        expect(url).toMatch('//testdomain/performance/bucketname/api?');
        expect(url).toMatch('filter_by=foo%3Abar');
        expect(url).toMatch('a=1');
      });
      
      it("constructs a backdrop query URL with multiple filter parameters", function () {
        var collection = new TestCollection([], {
          filterBy: {
            foo: 'bar',
            b: 'c'
          }
        });
        collection.queryParams = function () {
          return {
            a: 1
          };
        };
        var url = collection.url()
        expect(url).toMatch('//testdomain/performance/bucketname/api?');
        expect(url).toMatch('filter_by=foo%3Abar');
        expect(url).toMatch('filter_by=b%3Ac');
        expect(url).toMatch('a=1');
      });
    });
    
    describe("sortByAttr", function () {
      
      
      describe("default comparator", function () {
        var c;
        beforeEach(function() {
          c = new Collection([
            { numericAttr: 4, stringAttr: 'foo' },
            { numericAttr: 2, stringAttr: 'Baz' },
            { numericAttr: 5, stringAttr: 'bar' }
          ]);
        });
        
        it("stores current sort attribute and direction", function () {
          c.sortByAttr('numericAttr', true);
          expect(c.sortAttr).toEqual('numericAttr');
          expect(c.sortDescending).toBe(true);
          
          c.sortByAttr('stringAttr');
          expect(c.sortAttr).toEqual('stringAttr');
          expect(c.sortDescending).toBe(false);
        });
        
        it("re-sorts collection by a numeric attribute ascending", function () {
          c.sortByAttr('numericAttr');
          expect(c.at(0).attributes).toEqual({ numericAttr: 2, stringAttr: 'Baz' });
          expect(c.at(1).attributes).toEqual({ numericAttr: 4, stringAttr: 'foo' });
          expect(c.at(2).attributes).toEqual({ numericAttr: 5, stringAttr: 'bar' });
        });

        it("re-sorts collection by a numeric attribute descending", function () {
          c.sortByAttr('numericAttr', true);
          expect(c.at(0).attributes).toEqual({ numericAttr: 5, stringAttr: 'bar' });
          expect(c.at(1).attributes).toEqual({ numericAttr: 4, stringAttr: 'foo' });
          expect(c.at(2).attributes).toEqual({ numericAttr: 2, stringAttr: 'Baz' });
        });

        it("re-sorts collection by a string attribute ascending", function () {
          c.sortByAttr('stringAttr');
          expect(c.at(0).attributes).toEqual({ numericAttr: 5, stringAttr: 'bar' });
          expect(c.at(1).attributes).toEqual({ numericAttr: 2, stringAttr: 'Baz' });
          expect(c.at(2).attributes).toEqual({ numericAttr: 4, stringAttr: 'foo' });
        });

        it("re-sorts collection by a string attribute descending", function () {
          c.sortByAttr('stringAttr', true);
          expect(c.at(0).attributes).toEqual({ numericAttr: 4, stringAttr: 'foo' });
          expect(c.at(1).attributes).toEqual({ numericAttr: 2, stringAttr: 'Baz' });
          expect(c.at(2).attributes).toEqual({ numericAttr: 5, stringAttr: 'bar' });
        });

      });
      
      describe("custom comparators", function () {
        var c;
        beforeEach(function() {
          var TestCollection = Collection.extend({
            comparators: {
              numericAttr: function (attr, descending) {
                return function (a, b) {
                  // sorts odd numbers first, then even numbers
                  var aVal = a.get(attr);
                  var bVal = b.get(attr);
                  if ((aVal + bVal) % 2 === 0) {
                    if (aVal < bVal) return descending ? 1 : -1;
                    if (aVal > bVal) return descending ? -1 : 1;
                    return 0;
                  }
                  if (aVal % 2 === 0) return 1;
                  if (bVal % 2 === 0) return -1;
                };
              }
            }
          });
          c = new TestCollection([
            { numericAttr: 4, stringAttr: 'foo' },
            { numericAttr: 2, stringAttr: 'Baz' },
            { numericAttr: 5, stringAttr: 'bar' },
            { numericAttr: 3, stringAttr: 'foo' }
          ]);
        });
        
        it("re-sorts collection by an attribute using a custom comparator ascending", function () {
          c.sortByAttr('numericAttr');
          expect(c.at(0).attributes).toEqual({ numericAttr: 3, stringAttr: 'foo' });
          expect(c.at(1).attributes).toEqual({ numericAttr: 5, stringAttr: 'bar' });
          expect(c.at(2).attributes).toEqual({ numericAttr: 2, stringAttr: 'Baz' });
          expect(c.at(3).attributes).toEqual({ numericAttr: 4, stringAttr: 'foo' });
        });
        
        it("re-sorts collection by an attribute using a custom comparator descending", function () {
          c.sortByAttr('numericAttr', true);
          expect(c.at(0).attributes).toEqual({ numericAttr: 5, stringAttr: 'bar' });
          expect(c.at(1).attributes).toEqual({ numericAttr: 3, stringAttr: 'foo' });
          expect(c.at(2).attributes).toEqual({ numericAttr: 4, stringAttr: 'foo' });
          expect(c.at(3).attributes).toEqual({ numericAttr: 2, stringAttr: 'Baz' });
        });
      });
      
    });
    
    describe("defaultComparator", function () {
      
      describe("normal cases", function () {
        var c;
        beforeEach(function() {
          c = new Collection([
            { numericAttr: 4, stringAttr: 'foo' },
            { numericAttr: 2, stringAttr: 'Baz' },
            { numericAttr: 4, stringAttr: 'bar' }
          ]);
        });

        it("creates a function that sorts models by a numeric attribute ascending", function () {
          var comparator = c.defaultComparator('numericAttr');
          expect(comparator(c.at(0), c.at(1))).toEqual(1);
          expect(comparator(c.at(0), c.at(2))).toEqual(0);
          expect(comparator(c.at(1), c.at(2))).toEqual(-1);
        });

        it("creates a function that sorts models by a numeric attribute descending", function () {
          var comparator = c.defaultComparator('numericAttr', true);
          expect(comparator(c.at(0), c.at(1))).toEqual(-1);
          expect(comparator(c.at(0), c.at(2))).toEqual(0);
          expect(comparator(c.at(1), c.at(2))).toEqual(1);
        });

        it("creates a function that sorts models by a string attribute alphabetically, case insensitively and ascending", function () {
          var comparator = c.defaultComparator('stringAttr');
          expect(comparator(c.at(0), c.at(1))).toEqual(1);
          expect(comparator(c.at(0), c.at(2))).toEqual(1);
          expect(comparator(c.at(1), c.at(2))).toEqual(1);
        });

        it("creates a function that sorts models by a string attribute alphabetically, case insensitively and descending", function () {
          var comparator = c.defaultComparator('stringAttr', true);
          expect(comparator(c.at(0), c.at(1))).toEqual(-1);
          expect(comparator(c.at(0), c.at(2))).toEqual(-1);
          expect(comparator(c.at(1), c.at(2))).toEqual(-1);
        });
      });
      
      describe("handling of null values", function () {
        it("creates a function that considers nulls always lower than other values", function () {
          var c = new Collection([
            { numericAttr: 4, stringAttr: null },
            { numericAttr: null, stringAttr: 'foo' },
            { numericAttr: 2, stringAttr: 'bar' }
          ]);
          var comparator = c.defaultComparator('numericAttr');
          expect(comparator(c.at(0), c.at(1))).toEqual(-1);
          expect(comparator(c.at(0), c.at(2))).toEqual(1);
          expect(comparator(c.at(1), c.at(2))).toEqual(1);
          
          comparator = c.defaultComparator('numericAttr', true);
          expect(comparator(c.at(0), c.at(1))).toEqual(-1);
          expect(comparator(c.at(0), c.at(2))).toEqual(-1);
          expect(comparator(c.at(1), c.at(2))).toEqual(1);
          
          comparator = c.defaultComparator('stringAttr');
          expect(comparator(c.at(0), c.at(1))).toEqual(1);
          expect(comparator(c.at(0), c.at(2))).toEqual(1);
          expect(comparator(c.at(1), c.at(2))).toEqual(1);
          
          comparator = c.defaultComparator('stringAttr', true);
          expect(comparator(c.at(0), c.at(1))).toEqual(1);
          expect(comparator(c.at(0), c.at(2))).toEqual(1);
          expect(comparator(c.at(1), c.at(2))).toEqual(-1);
        });

        it("creates a function that does not compare null values", function () {
          var c = new Collection([
            { numericAttr: 4, stringAttr: null },
            { numericAttr: null, stringAttr: null },
            { numericAttr: null, stringAttr: 'bar' }
          ]);
          
          var comparator = c.defaultComparator('numericAttr');
          expect(comparator(c.at(0), c.at(1))).toEqual(-1);
          expect(comparator(c.at(0), c.at(2))).toEqual(-1);
          expect(comparator(c.at(1), c.at(2))).toEqual(null);
          
          comparator = c.defaultComparator('numericAttr', true);
          expect(comparator(c.at(0), c.at(1))).toEqual(-1);
          expect(comparator(c.at(0), c.at(2))).toEqual(-1);
          expect(comparator(c.at(1), c.at(2))).toEqual(null);
          
          comparator = c.defaultComparator('stringAttr');
          expect(comparator(c.at(0), c.at(1))).toEqual(null);
          expect(comparator(c.at(0), c.at(2))).toEqual(1);
          expect(comparator(c.at(1), c.at(2))).toEqual(1);
          
          comparator = c.defaultComparator('stringAttr', true);
          expect(comparator(c.at(0), c.at(1))).toEqual(null);
          expect(comparator(c.at(0), c.at(2))).toEqual(1);
          expect(comparator(c.at(1), c.at(2))).toEqual(1);
        });
      });

    });
  });
});
