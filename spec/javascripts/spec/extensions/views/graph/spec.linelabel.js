define([
  'extensions/views/graph/linelabel',
  'extensions/collections/graphcollection'
],
function (LineLabel, Collection) {

  describe("LineLabel Component", function () {
    describe("rendering tests", function () {

      var el, wrapper, lineLabel, collection;
      beforeEach(function() {
        collection = new Collection();
        collection.reset([
          { y: 30, yLabel: 30, title: 'Title 1', id: 'id1', href: '/link1', values: [
            { _count: 10 }, { _count: 20 }, { _count: 30, _start_at: moment('2013-08-26'), _end_at: moment('2013-09-02') }
          ] },
          { y: 80, yLabel: 80, title: 'Title 2', id: 'id2', href: '/link2', values: [
            { _count: 60 }, { _count: 70 }, { _count: 80, _start_at: moment('2013-08-26'), _end_at: moment('2013-09-02') }
          ] }
        ], {parse: true});

        el = $('<div></div>').appendTo($('body'));
        wrapper = LineLabel.prototype.d3.select(el[0]).append('svg').append('g');

        lineLabel = new LineLabel({
          interactive: false,
          showSquare: false,
          collection: collection
        });
        lineLabel.wrapper = wrapper;
        lineLabel.offset = 100;
        lineLabel.linePaddingInner = 20;
        lineLabel.linePaddingOuter = 30;
        lineLabel.graph = {
          innerWidth: 400,
          valueAttr: '_count'
        };
        lineLabel.margin = {
          top: 100,
          right: 200,
          bottom: 300,
          left: 400
        };
        lineLabel.positions = [
          { ideal: 30, min: 30, size: 20 },
          { ideal: 80, min: 80, size: 30 }
        ];
        spyOn(lineLabel, "setLabelPositions");
      });

      afterEach(function() {
        el.remove();
      });

      describe("render", function () {
        it("renders a label with text and line at the correct position", function () {
          lineLabel.render();

          var textLabels = lineLabel.$el.find('figcaption li');
          expect(textLabels.length).toEqual(2);

          expect(textLabels.eq(0)).toHaveText('Title 1');
          expect(textLabels.eq(0).prop('style').top).toEqual('130px');
          expect(textLabels.eq(0).prop('style').height).toEqual('20px');
          expect(textLabels.eq(0).prop('style').left).toEqual('800px');
          expect(textLabels.eq(0).prop('style').width).toEqual('200px');
          expect(textLabels.eq(0).prop('class')).toEqual('label0');

          expect(textLabels.eq(1)).toHaveText('Title 2');
          expect(textLabels.eq(1).prop('style').top).toEqual('180px');
          expect(textLabels.eq(1).prop('style').height).toEqual('30px');
          expect(textLabels.eq(1).prop('style').left).toEqual('800px');
          expect(textLabels.eq(1).prop('style').width).toEqual('200px');
          expect(textLabels.eq(1).prop('class')).toEqual('label1');

        });

        it("renders a label with text, square and line at the correct position", function () {
          lineLabel.showSquare = true;
          lineLabel.squareSize = 20;
          lineLabel.squarePadding = 6;
          lineLabel.render();
          var labels = wrapper.select('.labels');
          expect(labels.attr('transform')).toEqual('translate(500, 0)');
          var label1 = labels.select('g:nth-child(1)');
          var label2 = labels.select('g:nth-child(2)');

          expect(label1.select('line').length).toEqual(1);
          expect(label1.select('text').attr('transform')).toEqual('translate(26, 6)');
          expect(label1.select('text').text()).toEqual('Title 1');
          expect(label1.select('rect').attr('class')).toMatch('id1');
          expect(label1.select('rect').attr('class')).toMatch('square0');
          expect(label1.select('rect').attr('x')).toEqual('0');
          expect(label1.select('rect').attr('y')).toEqual('-10');
          expect(label1.select('rect').attr('width')).toEqual('20');
          expect(label1.select('rect').attr('height')).toEqual('20');

          expect(label2.select('line').length).toEqual(1);
          expect(label2.select('text').attr('transform')).toEqual('translate(26, 6)');
          expect(label2.select('text').text()).toEqual('Title 2');
          expect(label2.select('rect').attr('class')).toMatch('id2');
          expect(label2.select('rect').attr('class')).toMatch('square1');
          expect(label2.select('rect').attr('x')).toEqual('0');
          expect(label2.select('rect').attr('y')).toEqual('-10');
          expect(label2.select('rect').attr('width')).toEqual('20');
          expect(label2.select('rect').attr('height')).toEqual('20');
        });

        it("does not render links by default", function () {
          lineLabel.render();
          expect(lineLabel.$el.find('.label-link').length).toEqual(0);
        });

        it("renders links at the correct position when enabled", function () {
          lineLabel.attachLinks = true;
          lineLabel.render();
          var links = lineLabel.$el.find('.label-link');
          expect(links.length).toEqual(2);

          expect(links.eq(0).prop('style').top).toEqual('130px');
          expect(links.eq(0).prop('style').height).toEqual('20px');
          expect(links.eq(0).prop('style').left).toEqual('800px');
          expect(links.eq(0).prop('style').width).toEqual('200px');
          expect(links.eq(0).attr('href')).toEqual('/link1');

          expect(links.eq(1).prop('style').top).toEqual('180px');
          expect(links.eq(1).prop('style').height).toEqual('30px');
          expect(links.eq(1).prop('style').left).toEqual('800px');
          expect(links.eq(1).prop('style').width).toEqual('200px');
          expect(links.eq(1).attr('href')).toEqual('/link2');
        });

        it("renders a label with additional value text when enabled", function () {
          spyOn(lineLabel, "getNodeHeight").andReturn(18);
          lineLabel.showValues = true;
          lineLabel.render();

          var labels = wrapper.select('.labels');
          expect(labels.attr('transform')).toEqual('translate(500, 0)');
          var label1 = labels.select('g:nth-child(1)');
          var label2 = labels.select('g:nth-child(2)');
          expect(label1.select('line').length).toEqual(1);
          expect(label1.select('text.title').attr('transform')).toEqual('translate(0, 6)');
          expect(label1.select('text.title').text()).toEqual('Title 1');
          expect(label1.select('text.value').attr('transform')).toEqual('translate(0, 18)');
          expect(lineLabel.getNodeHeight).toHaveBeenCalledWith(label1.select('text.value').node());
          expect(label1.select('text.value').text()).toEqual('60');
          expect(label2.select('line').length).toEqual(1);
          expect(label2.select('text.title').attr('transform')).toEqual('translate(0, 6)');
          expect(label2.select('text.title').text()).toEqual('Title 2');
          expect(label2.select('text.value').attr('transform')).toEqual('translate(0, 18)');
          expect(label2.select('text.value').text()).toEqual('210');
        });

        it("renders a label with additional value text and percentage when enabled", function () {
          spyOn(lineLabel, "getNodeHeight").andReturn(18);
          lineLabel.showValues = true;
          lineLabel.showValuesPercentage = true;
          lineLabel.render();

          var labels = wrapper.select('.labels');
          expect(labels.attr('transform')).toEqual('translate(500, 0)');
          var label1 = labels.select('g:nth-child(1)');
          var label2 = labels.select('g:nth-child(2)');
          expect(label1.select('line').length).toEqual(1);
          expect(label1.select('text.title').attr('transform')).toEqual('translate(0, 6)');
          expect(label1.select('text.title').text()).toEqual('Title 1');
          expect(label1.select('text.value').attr('transform')).toEqual('translate(0, 18)');
          expect(label1.select('text.value').text()).toEqual('60 (22%)');
          expect(label2.select('line').length).toEqual(1);
          expect(label2.select('text.title').attr('transform')).toEqual('translate(0, 6)');
          expect(label2.select('text.title').text()).toEqual('Title 2');
          expect(label2.select('text.value').attr('transform')).toEqual('translate(0, 18)');
          expect(label2.select('text.value').text()).toEqual('210 (78%)');
        });

        it("renders a summary label when enabled", function () {
          spyOn(lineLabel, "getNodeHeight").andReturn(18);
          lineLabel.showSummary = true;
          lineLabel.showValues = true;
          lineLabel.showValuesPercentage = true;
          lineLabel.render();

          var labels = wrapper.select('.labels');
          var label1 = labels.select('g:nth-child(1)');
          var label2 = labels.select('g:nth-child(2)');
          var label3 = labels.select('g:nth-child(3)');

          expect(label1.attr('class')).toContain('summary');
          expect(label1.select('line').length).toEqual(1);
          expect(label1.select('text.title').attr('transform')).toEqual('translate(0, 6)');
          expect(label1.select('text.title').text()).toEqual('Total');
          expect(label1.select('text.value').attr('transform')).toEqual('translate(0, 18)');
          expect(label1.select('text.value').text()).toEqual('270 (100%)');
          expect(label2.select('line').length).toEqual(1);
          expect(label2.select('text.title').attr('transform')).toEqual('translate(0, 6)');
          expect(label2.select('text.title').text()).toEqual('Title 1');
          expect(label2.select('text.value').attr('transform')).toEqual('translate(0, 18)');
          expect(label2.select('text.value').text()).toEqual('60 (22%)');
          expect(label3.select('line').length).toEqual(1);
          expect(label3.select('text.title').attr('transform')).toEqual('translate(0, 6)');
          expect(label3.select('text.title').text()).toEqual('Title 2');
          expect(label3.select('text.value').attr('transform')).toEqual('translate(0, 18)');
          expect(label3.select('text.value').text()).toEqual('210 (78%)');
        });

        it("does not render a time period label by default", function () {
          lineLabel.render();
          expect(lineLabel.$el.find('figcaption.timeperiod').length).toEqual(0);
        });

        it("renders a time period label when enabled", function () {
          lineLabel.showTimePeriod = true;
          lineLabel.render();
          expect(lineLabel.$el.find('figcaption.timeperiod').length).toEqual(1);
          expect(lineLabel.$el.find('figcaption.timeperiod')).toHaveHtml('Last 3 weeks')
        });
      });

      describe("event handling", function () {
        var el, wrapper, lineLabel, options;
        beforeEach(function() {

          el = $('<div></div>').appendTo($('body'));
          wrapper = LineLabel.prototype.d3.select(el[0]).append('svg').append('g');
          options = {
            wrapper: wrapper,
            collection: collection,
            interactive: false,
            attachLinks: true,
            graph: {
              innerWidth: 400
            },
            margin: {
              top: 100,
              right: 200,
              bottom: 300,
              left: 400
            },
            positions: [
              { ideal: 30, min: 30, size: 20 },
              { ideal: 80, min: 80, size: 30 }
            ]
          }
          spyOn(LineLabel.prototype, "setLabelPositions");
        });

        afterEach(function() {
          el.remove();
        });

        describe("events", function () {
          it("listens for mousemove events for links on non-touch devices", function () {
            LineLabel.prototype.modernizr = { touch: false };
            lineLabel = new LineLabel(options);
            lineLabel.render();
            lineLabel.$el.find('.label-link').eq(0).trigger('mousemove');
            expect(collection.selectedIndex).toBe(0);

            $('body').trigger('mousemove');
            expect(collection.selectedIndex).toBe(null);
          });

          it("listens for touchstart events for links on touch devices", function () {
            LineLabel.prototype.modernizr = { touch: true };
            lineLabel = new LineLabel(options);
            lineLabel.render();
            lineLabel.$el.find('.label-link').eq(1).trigger('touchstart');
            expect(collection.selectedIndex).toBe(1);

            $('body').trigger('touchstart');
            expect(collection.selectedIndex).toBe(null);
          });
        });
      });

      describe("onChangeSelected", function () {
        it("adds class 'selected' to label of selected group", function () {
          lineLabel.render();
          var labels = wrapper.select('.labels');
          lineLabel.onChangeSelected(collection.at(1), 1);
          expect(labels.select('g:nth-child(1)').attr('class').indexOf('selected')).toBe(-1);
          expect(labels.select('g:nth-child(2)').attr('class').indexOf('selected')).not.toBe(-1);
          lineLabel.onChangeSelected(collection.at(0), 0);
          expect(labels.select('g:nth-child(1)').attr('class').indexOf('selected')).not.toBe(-1);
          expect(labels.select('g:nth-child(2)').attr('class').indexOf('selected')).toBe(-1);
          lineLabel.onChangeSelected(null, null);
          expect(labels.select('g:nth-child(1)').attr('class').indexOf('selected')).toBe(-1);
          expect(labels.select('g:nth-child(2)').attr('class').indexOf('selected')).toBe(-1);
        });

        it("displays the values for the current selection", function () {
          lineLabel.showValues = true;
          lineLabel.showValuesPercentage = true;
          lineLabel.showSummary = true;
          lineLabel.showTimePeriod = true;
          lineLabel.render();

          var labels = wrapper.select('.labels');
          var summary = labels.select('g:nth-child(1)');
          var label1 = labels.select('g:nth-child(2)');
          var label2 = labels.select('g:nth-child(3)');

          var models = collection.map(function (group) {
            return group.get('values').at(1);
          });
          collection.selectItem(null, 2);
          expect(summary.select('text.value').text()).toEqual('110 (100%)');
          expect(label1.select('text.value').text()).toEqual('30 (27%)');
          expect(label2.select('text.value').text()).toEqual('80 (73%)');
          expect(lineLabel.$el.find('figcaption.timeperiod')).toHaveHtml('26 Aug to 1 Sep 2013')

          collection.selectItem(null, null);
          expect(summary.select('text.value').text()).toEqual('270 (100%)');
          expect(label1.select('text.value').text()).toEqual('60 (22%)');
          expect(label2.select('text.value').text()).toEqual('210 (78%)');
          expect(lineLabel.$el.find('figcaption.timeperiod')).toHaveHtml('Last 3 weeks')
        });

        it("displays (no data) when the current selection is null", function () {
          collection.at(0).get('values').at(2).set('_count', null);
          lineLabel.showValues = true;
          lineLabel.showValuesPercentage = true;
          lineLabel.showSummary = true;
          lineLabel.showTimePeriod = true;
          lineLabel.render();

          var labels = wrapper.select('.labels');
          var summary = labels.select('g:nth-child(1)');
          var label1 = labels.select('g:nth-child(2)');
          var label2 = labels.select('g:nth-child(3)');

          var models = collection.map(function (group) {
            return group.get('values').at(1);
          });
          collection.selectItem(null, 2);
          expect(summary.select('text.value').text()).toEqual('80 (100%)');
          expect(label1.select('text.value').text()).toEqual('(no data)');
          expect(label2.select('text.value').text()).toEqual('80 (100%)');
          expect(lineLabel.$el.find('figcaption.timeperiod')).toHaveHtml('26 Aug to 1 Sep 2013')

          collection.selectItem(null, null);
          expect(summary.select('text.value').text()).toEqual('240 (100%)');
          expect(label1.select('text.value').text()).toEqual('30 (13%)');
          expect(label2.select('text.value').text()).toEqual('210 (88%)');
          expect(lineLabel.$el.find('figcaption.timeperiod')).toHaveHtml('Last 3 weeks')
        });

        it("displays (no data) for all items when the current selection is null", function () {
          collection.at(0).get('values').at(2).set('_count', null);
          collection.at(1).get('values').at(2).set('_count', null);
          lineLabel.showValues = true;
          lineLabel.showValuesPercentage = true;
          lineLabel.showSummary = true;
          lineLabel.showTimePeriod = true;
          lineLabel.render();

          var labels = wrapper.select('.labels');
          var summary = labels.select('g:nth-child(1)');
          var label1 = labels.select('g:nth-child(2)');
          var label2 = labels.select('g:nth-child(3)');

          var models = collection.map(function (group) {
            return group.get('values').at(1);
          });
          collection.selectItem(null, 2);
          expect(summary.select('text.value').text()).toEqual('(no data)');
          expect(label1.select('text.value').text()).toEqual('(no data)');
          expect(label2.select('text.value').text()).toEqual('(no data)');
          expect(lineLabel.$el.find('figcaption.timeperiod')).toHaveHtml('26 Aug to 1 Sep 2013')

          collection.selectItem(null, null);
          expect(summary.select('text.value').text()).toEqual('160 (100%)');
          expect(label1.select('text.value').text()).toEqual('30 (19%)');
          expect(label2.select('text.value').text()).toEqual('130 (81%)');
          expect(lineLabel.$el.find('figcaption.timeperiod')).toHaveHtml('Last 3 weeks')
        });
      });

      describe("onHover", function () {
        beforeEach(function() {
          spyOn(collection, "selectItem");
          lineLabel.render();
        });

        it("selects the closest label", function () {
          lineLabel.onHover({ x: null, y: 54 });
          expect(collection.selectItem).toHaveBeenCalledWith(0);
          lineLabel.onHover({ x: null, y: 56 });
          expect(collection.selectItem).toHaveBeenCalledWith(1);
        });

        it("unselects when the closest label is already selected and the toggle option is used", function () {
          lineLabel.onHover({ x: null, y: 54, toggle: true });
          expect(collection.selectItem).toHaveBeenCalledWith(0);
          collection.selectedIndex = 0;
          lineLabel.onHover({ x: null, y: 54, toggle: true });
          expect(collection.selectItem).toHaveBeenCalledWith(null);
        });
      });

    });

    describe("setLabelPositions", function() {
      var el, wrapper, lineLabel, graph, collection;
      beforeEach(function() {
        collection = new Collection([
          {
            id: 'a',
            values: new Collection([
              { _count: 1, alternative: 8 },
              { _count: 4, alternative: 5 },
              { _count: 7, alternative: 2 }
            ])
          },
          {
            id: 'b',
            values: new Collection([
              { _count: 2, alternative: 9 },
              { _count: 5, alternative: 6 },
              { _count: 8, alternative: 3 }
            ])
          }
        ]);

        var yScale = jasmine.createSpy();
        yScale.plan = function (val) {
          return val * val;
        };
        graph = {
          valueAttr: '_count',
          innerWidth: 100,
          innerHeight: 100,
          getYPos: function (groupIndex, modelIndex) {
            return collection.at(groupIndex).get('values').at(modelIndex).get(graph.valueAttr);
          },
          getY0Pos: function (groupIndex, modelIndex) {
            if (groupIndex > 0) {
              return collection.at(groupIndex - 1).get('values').at(modelIndex).get(graph.valueAttr);
            } else {
              return 0;
            }
          }
        };
        lineLabel = new LineLabel({
          scales: {
            y: yScale
          },
          interactive: false,
          collection: collection,
          offset: 100,
          linePaddingInner: 20,
          linePaddingOuter: 30,
          graph: graph
        });

        el = $('<div></div>').appendTo($('body'));
        wrapper = lineLabel.d3.select(el[0]).append('svg').append('g');
        wrapper.selectAll('g').data(collection.models)
          .enter().append('g').append('text');
        wrapper.selectAll('g').each(function (metaModel) {
          spyOn(this, "getBBox").andReturn({
            height: 20
          });
        });
        spyOn(lineLabel, "calcPositions").andReturn([
          { min: 20 },
          { min: 30 }
        ]);
      });

      afterEach(function() {
        el.remove();
      });

      it("positions labels vertically so they do not collide and snaps to half pixels to avoid antialiasing", function() {
        lineLabel.applyConfig('overlay');
        lineLabel.setLabelPositions(wrapper.selectAll('g'));
        expect(lineLabel.calcPositions).toHaveBeenCalled();
        var startPositions = lineLabel.calcPositions.argsForCall[0][0];
        expect(lineLabel.scales.y).toHaveBeenCalledWith(7);
        expect(startPositions[0]).toEqual({
          ideal: 49, // yScale was applied to '_count' attribute of last element in line 'a'
          size: 20,
          id: 'a'
        });
        expect(lineLabel.scales.y).toHaveBeenCalledWith(8);
        expect(startPositions[1]).toEqual({
          ideal: 64, // yScale was applied to '_count' attribute of last element in line 'b'
          size: 20,
          id: 'b'
        });

        expect(wrapper.select('g:nth-child(1)').attr('transform')).toEqual('translate(0, 20.5)');
        expect(wrapper.select('g:nth-child(2)').attr('transform')).toEqual('translate(0, 30.5)');
      });

      it("uses the last non-null value for positioning in overlay configuration", function() {
        collection.at(0).get('values').last().set('_count', null);
        collection.at(1).get('values').last().set('_count', null);
        lineLabel.applyConfig('overlay');
        lineLabel.setLabelPositions(wrapper.selectAll('g'));
        expect(lineLabel.calcPositions).toHaveBeenCalled();
        var startPositions = lineLabel.calcPositions.argsForCall[0][0];
        expect(lineLabel.scales.y).toHaveBeenCalledWith(4);
        expect(startPositions[0]).toEqual({
          ideal: 16, // yScale was applied to '_count' attribute of penultimate element in line 'a'
          size: 20,
          id: 'a'
        });
        expect(lineLabel.scales.y).toHaveBeenCalledWith(5);
        expect(startPositions[1]).toEqual({
          ideal: 25, // yScale was applied to '_count' attribute of penultimate element in line 'b'
          size: 20,
          id: 'b'
        });
      });

      it("positions labels closest to the centre of the area in stack configuration", function() {
        lineLabel.applyConfig('stack');
        lineLabel.setLabelPositions(wrapper.selectAll('g'));
        expect(lineLabel.calcPositions).toHaveBeenCalled();
        var startPositions = lineLabel.calcPositions.argsForCall[0][0];
        expect(lineLabel.scales.y).toHaveBeenCalledWith(3.5);
        expect(startPositions[0]).toEqual({
          ideal: 12.25, // centre of first area
          size: 20,
          id: 'a'
        });
        expect(lineLabel.scales.y).toHaveBeenCalledWith(7.5);
        expect(startPositions[1]).toEqual({
          ideal: 56.25, // centre of second area
          size: 20,
          id: 'b'
        });

        expect(wrapper.select('g:nth-child(1)').attr('transform')).toEqual('translate(0, 20.5)');
        expect(wrapper.select('g:nth-child(2)').attr('transform')).toEqual('translate(0, 30.5)');
      });

      it("uses the last non-null value for positioning in stack configuration", function() {
        collection.at(0).get('values').last().set('_count', null);
        collection.at(1).get('values').last().set('_count', null);

        lineLabel.applyConfig('stack');
        lineLabel.setLabelPositions(wrapper.selectAll('g'));
        expect(lineLabel.calcPositions).toHaveBeenCalled();
        var startPositions = lineLabel.calcPositions.argsForCall[0][0];
        expect(lineLabel.scales.y).toHaveBeenCalledWith(2);
        expect(startPositions[0]).toEqual({
          ideal: 4, // centre of first area when using penultimate value
          size: 20,
          id: 'a'
        });
        expect(lineLabel.scales.y).toHaveBeenCalledWith(4.5);
        expect(startPositions[1]).toEqual({
          ideal: 20.25, // centre of second area when using penultimate value
          size: 20,
          id: 'b'
        });
      });

    });

    describe("updateLines", function() {
      var el, wrapper, lineLabel;
      beforeEach(function() {
        lineLabel = new LineLabel({
          interactive: false,
          collection: {
            on: jasmine.createSpy()
          }
        });
        lineLabel.offset = 100;
        lineLabel.linePaddingInner = 20;
        lineLabel.linePaddingOuter = 30;

        el = $('<div></div>').appendTo($('body'));
        wrapper = lineLabel.d3.select(el[0]).append('svg').append('g');
        var collection = new Collection([
          { y: 30, yLabel: 40 },
          { y: 80, yLabel: 80 }
        ]);
        lineLabel.positions = [
          { ideal: 30, min: 40 },
          { ideal: 80, min: 80 }
        ];
        wrapper.selectAll('g.label').data(collection.models)
          .enter().append('g').attr('class', 'label').append('line');
      });

      afterEach(function() {
        el.remove();
      });

      it("updates lines to connect last items with labels", function() {
        lineLabel.updateLines(wrapper.selectAll('g.label'));
        var line1 = d3.select(wrapper.selectAll('line')[0][0]);
        var line2 = d3.select(wrapper.selectAll('line')[0][1]);
        expect(parseFloat(line1.attr('x1'))).toEqual(-80);
        expect(parseFloat(line1.attr('x2'))).toEqual(-30);
        expect(parseFloat(line1.attr('y1'))).toEqual(-10);
        expect(parseFloat(line1.attr('y2'))).toEqual(0);
        expect(parseFloat(line2.attr('x1'))).toEqual(-80);
        expect(parseFloat(line2.attr('x2'))).toEqual(-30);
        expect(parseFloat(line2.attr('y1'))).toEqual(0);
        expect(parseFloat(line2.attr('y2'))).toEqual(0);
      });

      it("displays straight lines with 'crisp' option", function() {
        lineLabel.updateLines(wrapper.selectAll('g.label'));
        var line1 = d3.select(wrapper.selectAll('line')[0][0]);
        var line2 = d3.select(wrapper.selectAll('line')[0][1]);
        expect(line1.attr('class')).toBeFalsy();
        expect(line2.attr('class')).toEqual('crisp');
      });
    });

    describe("truncateWithEllipsis", function() {

      var el, wrapper;
      beforeEach(function() {
        el = $('<div></div>').appendTo($('body'));
        wrapper = LineLabel.prototype.d3.select(el[0]).append('svg').append('g');
        wrapper.append('text')
          .text('XXX XXXXXX')
          .attr('style', 'font: Arial; font-size:100px');
      });

      afterEach(function() {
        el.remove();
      });

      it("does not truncate text elements when they fit", function() {
        LineLabel.prototype.truncateWithEllipsis(wrapper, 1000);
        expect(wrapper.select('text').text()).toEqual('XXX XXXXXX');
      });

      it("truncates text elements that don't fit with a default symbol", function() {
        LineLabel.prototype.truncateWithEllipsis(wrapper, 500);
        expect(wrapper.select('text').text()).toEqual('XXX XX…');
      });

      it("does not leave trailing spaces", function() {
        LineLabel.prototype.truncateWithEllipsis(wrapper, 390);
        expect(wrapper.select('text').text()).toEqual('XXX…');
      });

      it("truncates text elements that don't fit with a custom symbol", function() {
        LineLabel.prototype.truncateWithEllipsis(wrapper, 460, '*');
        expect(wrapper.select('text').text()).toEqual('XXX XX*');
      });

    });

    describe("calcPositions", function() {

      var line;
      beforeEach(function() {
        line = new LineLabel({
          interactive: false,
          collection: {
            on: jasmine.createSpy()
          }
        });
      });

      it("places non-adjacent items at their ideal positions when possible", function() {
        var initial = [
          { ideal:  0, size: 10 },
          { ideal: 40, size: 20 },
          { ideal: 80, size: 20 }
        ];
        var result = line.calcPositions(initial);
        expect(result[0].min).toEqual(0);
        expect(result[1].min).toEqual(40);
        expect(result[2].min).toEqual(80);
      });

      it("places adjacent items at their ideal positions when possible", function() {
        var initial = [
          { ideal:  0, size: 10 },
          { ideal: 10, size: 20 },
          { ideal: 30, size: 20 }
        ];
        var result = line.calcPositions(initial);
        expect(result[0].min).toEqual(0);
        expect(result[1].min).toEqual(10);
        expect(result[2].min).toEqual(30);
      });

      it("places items as close to their ideal positions as possible", function() {
        var initial = [
          { ideal:  5, size: 10 },
          { ideal: 10, size: 20 },
          { ideal: 25, size: 20 }
        ];
        var result = line.calcPositions(initial);
        expect(Math.round(result[0].min)).toEqual(0);
        expect(Math.round(result[1].min)).toEqual(10);
        expect(Math.round(result[2].min)).toEqual(30);
      });

      it("places multiple clusters of items as close to their ideal positions as possible", function() {
        var initial = [
          { ideal:  4, size: 10 },
          { ideal: 10, size: 20 },
          { ideal: 30, size: 20 },
          { ideal: 40, size: 20 }
        ];
        var result = line.calcPositions(initial);
        expect(Math.round(result[0].min)).toEqual(-2);
        expect(Math.round(result[1].min)).toEqual(8);
        expect(Math.round(result[2].min)).toEqual(28);
        expect(Math.round(result[3].min)).toEqual(48);
      });

      it("keeps items within minimum bounds", function() {
        var initial = [
          { ideal:  5, size: 10 },
          { ideal: 10, size: 20 },
          { ideal: 25, size: 20 }
        ];
        var bounds = { min: 5, max: 100 };
        var result = line.calcPositions(initial, bounds);
        expect(Math.round(result[0].min)).toEqual(5);
        expect(Math.round(result[1].min)).toEqual(15);
        expect(Math.round(result[2].min)).toEqual(35);
      });

      it("keeps items within minimum bounds", function() {
        var initial = [
          { ideal:  5, size: 10 },
          { ideal: 10, size: 20 },
          { ideal: 25, size: 20 }
        ];
        var bounds = { min: -100, max: 40 };
        var result = line.calcPositions(initial, bounds);
        expect(Math.round(result[0].min)).toEqual(-10);
        expect(Math.round(result[1].min)).toEqual(0);
        expect(Math.round(result[2].min)).toEqual(20);
      });

      it("overlaps items as necessary if available space is not sufficient", function () {
        var initial = [
          { ideal:  5, size: 10 },
          { ideal: 10, size: 20 },
          { ideal: 25, size: 20 }
        ];
        var bounds = { min: 5, max: 50 };
        var result = line.calcPositions(initial, bounds);
        expect(Math.round(result[0].min)).toEqual(5);
        expect(Math.round(result[1].min)).toEqual(14);
        expect(Math.round(result[2].min)).toEqual(32);
      });
    });
  });

});
