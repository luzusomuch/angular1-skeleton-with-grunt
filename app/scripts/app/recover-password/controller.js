(function () {
  'use strict';
  angular.module('measureApp').controller('RecoverPasswordController', RecoverPasswordController);

  /* @ngInject */
  function RecoverPasswordController($scope, $stateParams, $state, AuthService, growl) {
    $scope.submitted = false;

    $scope.submit = function(form) {
      if (form.$valid && $scope.password === $scope.rePassword) {
        $scope.submitted = true;
        AuthService.recoverPassword($stateParams.token, $scope.password).then(function() {
          $scope.submitted = false;
          growl.success('Recovered password successfully. Please loin.');
          $state.go('login');
        }).catch(function() {
          $scope.submitted = false;
          growl.error('Something wrong');
        });
      }
    };
  }
})();
