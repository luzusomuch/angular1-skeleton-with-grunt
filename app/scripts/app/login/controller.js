(function () {
  'use strict';
  angular.module('measureApp').controller('LoginController', LoginController);

  /* @ngInject */
  function LoginController($scope, $state, AuthService) {
    $scope.user = {
      uid: '',
      password: ''
    };

    $scope.submit = function(form) {
      console.log($scope.user);
      if (form.$valid) {
        AuthService.login($scope.user);
      }
    };
  }
})();
