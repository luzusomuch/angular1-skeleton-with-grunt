'use strict';
angular.module('measureApp').filter('capitalize', function () {
  return function (input) {
    if (!input) {
      return '';
    }
    if (input != null) {
      input = input.toLowerCase();
    }
    return input.substring(0, 1).toUpperCase() + input.substring(1);
  };
});