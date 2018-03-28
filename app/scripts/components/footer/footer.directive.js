'use strict';

angular.module('measureApp').directive('footer', function (AuthService) {
  return {
    restrict: 'E',
    templateUrl: 'scripts/components/footer/view.html',
    link: function(scope) {
      console.log(scope);
    }
  };
});
