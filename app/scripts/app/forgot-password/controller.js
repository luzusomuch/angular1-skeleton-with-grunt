(function () {
  'use strict';
  angular.module('measureApp').controller('ForgotPasswordController', ForgotPasswordController);

  /* @ngInject */
  function ForgotPasswordController($scope, $state, AuthService, growl) {
    $scope.submitted = false;

    $scope.submit = function(form) {
      if (form.$valid) {
        $scope.submitted = true;
        AuthService.forgotPassword($scope.email).then(function() {
          $scope.submitted = false;
          growl.success('Please check your email to get for recover password.');
          $state.go('recoverPassword');
        }).catch(function() {
          $scope.submitted = false;
          growl.error('Something wrong');
        });
      }
    };
  }
})();
