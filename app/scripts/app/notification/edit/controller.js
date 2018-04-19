(function () {
  'use strict';
  angular.module('measureApp').controller('EditNotificationController', EditNotificationController);

  /* @ngInject */
  function EditNotificationController($scope, $stateParams, contentDetail, growl, ConfigService) {
    $scope.data = contentDetail;
    $scope.submitted = false;

    $scope.submit = function(form) {
      if (form.$valid) {
        $scope.submitted = true;
        var data = _.pick($scope.data, ['key', 'value']);
        ConfigService.update({id: $stateParams.id}, data).$promise.then(function() {
          $scope.submitted = false;
          growl.success('Updated content successfully');
        }).catch(function() {
          $scope.submitted = false;
          growl.error('Error when update content');
        });
      }
    };
  }
})();
