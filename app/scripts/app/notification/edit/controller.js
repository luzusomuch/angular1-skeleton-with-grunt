(function () {
  'use strict';
  angular.module('measureApp').controller('EditNotificationController', EditNotificationController);

  /* @ngInject */
  function EditNotificationController($scope, $stateParams, $state, contentDetail, growl, ConfigService) {
    $scope.data = contentDetail;
    $scope.data.value = {
      title: $scope.data.value.title,
      body: $scope.data.value.body
    };
    $scope.submitted = false;

    $scope.submit = function(form) {
      if (form.$valid) {
        $scope.submitted = true;
        var data = _.pick($scope.data, ['value']);
        ConfigService.update({id: $stateParams.id}, data).$promise.then(function() {
          $scope.submitted = false;
          growl.success('Updated content successfully');
          $state.go('app.notification.list');
        }).catch(function() {
          $scope.submitted = false;
          growl.error('Error when update content');
        });
      }
    };
  }
})();
