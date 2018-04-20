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
          form.$setDirty();
          form.$setUntouched();
          form.$setPristine();
          $scope.data = {};
          growl.success('Created new content successfully');
        }).catch(function() {
          growl.error('Error when create new content');
          $scope.submitted = false;
        }); 
      }
    };
  }
})();
