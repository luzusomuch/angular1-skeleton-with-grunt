(function () {
  'use strict';
  angular.module('measureApp').controller('EditNotificationController', EditNotificationController);

  /* @ngInject */
  function EditNotificationController($scope, $stateParams, notificationDetail, growl, PushNotificationService) {
    $scope.data = notificationDetail;
    $scope.submitted = false;

    $scope.submit = function(form) {
      if (form.$valid) {
        $scope.submitted = true;
        var data = _.pick($scope.data, ['key', 'value']);
        PushNotificationService.update({id: $stateParams.id}, data).$promise.then(function() {
          $scope.submitted = false;
          growl.success('Updated notification successfully');
        }).catch(function() {
          $scope.submitted = false;
          growl.error('Error when update notification');
        });
      }
    };
  }
})();
