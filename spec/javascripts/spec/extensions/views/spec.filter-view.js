define([
  'extensions/views/filter-view',
  'extensions/models/model'
],
function (Filter, Model) {
  
  describe("render", function () {
    var model;
    beforeEach(function() {
      model = new Model();
    });
    
    it("populates the wrapper element with an input element", function () {
      var view = new Filter({
        model: model
      });
      jasmine.renderView(view, function () {
        expect(view.$el.find('input')).toExist();
        expect(view.$el.find('input').prop('placeholder')).toBeFalsy();
        expect(view.$el.find('label')).not.toExist();
      });
    });
    
    it("populates the wrapper element with an input element and a label", function () {
      var view = new Filter({
        model: model,
        label: 'test label'
      });
      jasmine.renderView(view, function () {
        expect(view.$el.find('input')).toExist();
        expect(view.$el.find('label')).toExist();
        expect(view.$el.find('label')).toHaveText('test label');
      });
    });
    
    it("populates the wrapper element with an input element and a placeholder message", function () {
      var view = new Filter({
        model: model,
        placeholder: 'test placeholder'
      });
      jasmine.renderView(view, function () {
        expect(view.$el.find('input')).toExist();
        expect(view.$el.find('input')).toHaveProp('placeholder', 'test placeholder');
      });
    });
    
  });
  
  describe("events", function () {
    var model;
    beforeEach(function() {
      model = new Model();
    });
    
    it("listens to keyup events", function () {
      spyOn(Filter.prototype, "onKeyUp");
      var view = new Filter({
        model: model
      });
      jasmine.renderView(view, function () {
        view.$el.find('input').trigger('keyup');
      });
      expect(view.onKeyUp).toHaveBeenCalled();
    });
  });
  
  describe("onKeyUp", function () {
    
    var escapeKey = 27;
    
    var view, model;
    beforeEach(function() {
      model = new Model();
      view = new Filter({
        model: model 
      });
    });
    
    it("sets the filter term on the model", function () {
      jasmine.renderView(view, function () {
        view.inputEl.val('foo');
        view.onKeyUp({});
        expect(model.get('term')).toEqual('foo');
      });
    });
    
    it("resets the search term on escape", function () {
      jasmine.renderView(view, function () {
        view.inputEl.val('foo');
        view.onKeyUp({
          keyCode: escapeKey
        });
        expect(model.get('term')).toEqual('');
        expect(view.inputEl.val()).toEqual('');
      });
    });
    
    it("blurs on escape when the search term was empty", function () {
      jasmine.renderView(view, function () {
        spyOn(view.inputEl, "blur").andCallThrough();
        view.inputEl.val('');
        view.onKeyUp({
          keyCode: escapeKey
        });
        expect(view.inputEl.val()).toEqual('');
        expect(view.inputEl.blur).toHaveBeenCalled();
      });
    });
  });
});
