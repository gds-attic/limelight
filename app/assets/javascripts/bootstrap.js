define([ 'require', 'jquery' ], function (require, $) {
  function backdropUrl() {
    var backdropUrl = $('#wrapper').data('backdrop-url');
    return backdropUrl || "";
  }

  function useFakeApi() {
    return backdropUrl().indexOf('//fakeapi') !== -1
  }

  var controller = $('#wrapper').data('controller');
  if (useFakeApi()) {
    require(['fakeapi'], function(_) {
      require([ controller ]);
    });
  } else {
    require([ controller ]);
  }
});
