(function () {
  'use strict';
  angular.module('measureApp').controller('LoginController', LoginController);

  /* @ngInject */
  function LoginController($scope, $state, AuthService, growl) {
    $scope.user = {
      uid: '',
      password: ''
    };

    $scope.submit = function(form) {
      if (form.$valid) {
        AuthService.login($scope.user).then(function() {
          $state.go('app.show.list');
        }).catch(function(err) {
          growl.error('Invalid email or password');
        });
      }
    };
  }
})();
