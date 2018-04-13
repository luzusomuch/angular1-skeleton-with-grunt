(function () {
  'use strict';
  angular.module('measureApp').controller('SettingsController', SettingsController);

  /* @ngInject */
  function SettingsController($scope, growl, TestService) {
    $scope.submitted = false;
    $scope.data = null;

    $scope.testPartnerHook = function() {
      $scope.submitted = true;
      TestService.testPartnerHook().$promise.then(function(resp) {
        growl.success('Test partner hook successfully');
        $scope.data = resp;
      }).catch(function(err) {
        growl.error('Error when test partner hook');
        $scope.data = err;
      });
    };
  }
})();
