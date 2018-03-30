(function () {
  'use strict';
  angular.module('measureApp').controller('UpdateShowController', UpdateShowController);

  /* @ngInject */
  function UpdateShowController($scope, $stateParams, showDetail, pageSettings, ShowService, growl) {
    $scope.isAllowUpdateShow = showDetail.status === 'unpublished';
    $scope.data = angular.copy(showDetail);
    $scope.data.expiresAt = new Date($scope.data.expiresAt);
    $scope.dateOptions = {
      minDate: new Date(),
    };
    $scope.showStatuses = pageSettings['SHOW_STATUSES'];
    $scope.submitted = false;

    $scope.submit = function(form) {
      if (!$scope.isAllowUpdateShow) {
        return growl.error('This show do not allow to update');
      }
      if (form.$valid) {
        var data = _.pick($scope.data, ['title', 'status', 'expiresAt', 'videoId']);
        ShowService.update({id: $stateParams.id}, data).$promise.then(function(resp) {
          console.log(resp);
        }).catch(function() {
          growl.error('Something wrong. Please try again later');
        });
      }
    };
  }
})();
