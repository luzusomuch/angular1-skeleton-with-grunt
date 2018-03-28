'use strict';

angular.module('measureApp').directive('header', function (AuthService) {
  return {
    restrict: 'E',
    templateUrl: 'scripts/components/header/view.html',
    link: function(scope) {
      scope.menuItems = [{
        label: 'Challenges',
        sref: 'app.challenge.list',
        faClass: 'fa fa-history'
      }];
    }
  };
});
