(function () {
  'use strict';
  angular.module('measureApp').controller('UpdateShowController', UpdateShowController);

  /* @ngInject */
  function UpdateShowController($scope, $stateParams, showDetail, pageSettings, ShowService, 
    growl, showStatusesUnableToUpdate, VideoService, UploadService) {
    $scope.isAllowUpdateShow = showStatusesUnableToUpdate.indexOf(showDetail.status) === -1;
    $scope.data = angular.copy(showDetail);
    $scope.data.expiresAt = new Date($scope.data.expiresAt);
    $scope.showStatuses = pageSettings['SHOW_STATUSES'];
    $scope.submitted = false;
    $scope.dateError = false;
    $scope.isUploading = false;

    // calculate min date based on challenges list
    var minDate = new Date();
    // if (showDetail.challenges && showDetail.challenges.length > 0) {
    //   minDate = new Date(_.max(_.map(showDetail.challenges, function(challenge) {
    //     return challenge.expiresAt;
    //   })));
    // }
    $scope.dateOptions = {
      minDate: minDate
    };

    $scope.upload = function(file) {
      $scope.isUploading = true;
      VideoService.create().$promise.then(function(videoData) {
        UploadService.uploadVideo(videoData, file).then(function() {
          VideoService.update({id: videoData._id}, {status: 'uploaded'});
          $scope.data.videoId = videoData._id;
          $scope.isUploading = false;
        }).catch(function(err) {
          growl.error('Failed to upload video');
          $scope.isUploading = false;
        });
      }).catch(function() {
        growl.error('Failed to upload video');
        $scope.isUploading = false;
      });
    };

    $scope.submit = function(form) {
      $scope.dateError = false;
      if (!$scope.isAllowUpdateShow) {
        return growl.error('This show do not allow to update');
      }
      if ($scope.isUploading) {
        return growl.error('Please wait until upload process done');
      }
      // if (moment(moment($scope.data.expiresAt).format('YYYY-MM-DD')).isBefore(moment(minDate).format('YYYY-MM-DD'))) {
      //   $scope.dateError = true;
      //   return false;
      // }
      if (form.$valid) {
        // var data = _.pick($scope.data, ['title', 'status', 'expiresAt', 'videoId']);
        var data = _.pick($scope.data, ['title', 'status', 'videoId']);
        ShowService.update({id: $stateParams.id}, data).$promise.then(function() {
          growl.success('Updated show successfully');
        }).catch(function() {
          growl.error('Something wrong. Please try again later');
        });
      }
    };
  }
})();
