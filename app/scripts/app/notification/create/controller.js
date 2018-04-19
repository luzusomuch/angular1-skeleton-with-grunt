(function () {
  'use strict';
  angular.module('measureApp').controller('CreateNotificationController', CreateNotificationController);

  /* @ngInject */
  function CreateNotificationController($scope, $state, growl, ConfigService) {
    $scope.data = {};
    $scope.submitted = false;

    $scope.submit = function(form) {
      if (form.$valid) {
        $scope.submitted = true;
        $scope.data.category = 'NOTIFICATION';
        ConfigService.create($scope.data).$promise.then(function() {
          $scope.submitted = false;
          $scope.data = {};
          growl.success('Created new notification successfully');
        }).catch(function() {
          growl.error('Error when create new notification');
          $scope.submitted = false;
        }); 
      }
    };
  }
})();
