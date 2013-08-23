define(function() {

  /*
   * Numbers utility functions
   */

  var areClose = function(aNumber, anotherNumber, precision) {
    var delta = Math.pow(10, -precision);
    return Math.abs(aNumber - anotherNumber) < delta;
  };

  var roundHalfUp = function(number, precision) {
    if (areClose(number, 0, precision)) return 0;
    var factor = Math.pow(10, precision);
    return Math.round(number * factor) / factor;
  };

  return {
    roundHalfUp: roundHalfUp,
    areClose: areClose
  };
});