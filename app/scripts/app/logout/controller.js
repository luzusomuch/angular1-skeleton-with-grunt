(function () {
  'use strict';
  angular.module('measureApp').controller('LogoutController', LogoutController);

  /* @ngInject */
  function LogoutController($state, AuthService) {
    AuthService.logout();
    $state.go('login');
  }
})();
