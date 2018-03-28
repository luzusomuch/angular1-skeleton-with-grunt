'use strict';

angular.module('measureApp').directive('header', function (AuthService) {
  return {
    restrict: 'E',
    templateUrl: 'scripts/components/header/header.html',
    link: function(scope) {
      console.log(scope);
    }
  };
});
