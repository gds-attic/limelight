define({
  load: function(name, req, onLoad, config) {
    if ($('.lte-ie8').length) {
      // browser does not support d3, skip
      onLoad();
    } else {
      req(['d3'], function (d3) {
        onLoad(d3);
      });
    }
  }
});
