(function () {
  'use strict';
  angular.module('measureApp').controller('CreateNotificationController', CreateNotificationController);

  /* @ngInject */
  function CreateNotificationController($scope, $state, growl, PushNotificationService) {
    $scope.data = {};
    $scope.submitted = false;

    $scope.submit = function(form) {
      if (form.$valid) {
        $scope.submitted = true;
        PushNotificationService.create($scope.data).$promise.then(function() {
          $scope.submitted = false;
          growl.error('Created new notification successfully');
          $state.go('app.notification.list');
        }).catch(function() {
          growl.error('Error when create new notification');
          $scope.submitted = false;
        }); 
      }
    };
  }
})();
