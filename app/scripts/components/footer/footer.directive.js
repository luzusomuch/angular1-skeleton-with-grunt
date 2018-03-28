'use strict';

angular.module('measureApp').directive('footer', function (AuthService) {
  return {
    restrict: 'E',
    templateUrl: 'scripts/components/footer/footer.html',
    link: function(scope) {
      console.log(scope);
    }
  };
});
