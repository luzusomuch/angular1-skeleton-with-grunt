(function () {
  'use strict';
  angular.module('measureApp').controller('UpdateShowController', UpdateShowController);

  /* @ngInject */
  function UpdateShowController($scope, $stateParams, showDetail, pageSettings, ShowService, growl) {
    $scope.isAllowUpdateShow = ['published', 'closed'].indexOf(showDetail.status) === -1;
    $scope.data = angular.copy(showDetail);
    $scope.data.expiresAt = new Date($scope.data.expiresAt);
    $scope.showStatuses = pageSettings['SHOW_STATUSES'];
    $scope.submitted = false;
    $scope.dateError = false;
    $scope.isUploading = false;

    // calculate min date based on challenges list
    var minDate = new Date();
    if (showDetail.challenges && showDetail.challenges.length > 0) {
      minDate = new Date(_.max(_.map(showDetail.challenges, function(challenge) {
        return challenge.expiresAt;
      })));
    }
    $scope.dateOptions = {
      minDate: minDate
    };

    $scope.submit = function(form) {
      $scope.dateError = false;
      if (!$scope.isAllowUpdateShow) {
        return growl.error('This show do not allow to update');
      }
      if ($scope.isUploading) {
        return growl.error('Please wait until upload process done');
      }
      if (moment(moment($scope.data.expiresAt).format('YYYY-MM-DD')).isBefore(moment(minDate).format('YYYY-MM-DD'))) {
        return $scope.dateError = true;
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
