(function () {
  'use strict';
  angular.module('measureApp').controller('UpdateChallengeController', UpdateChallengeController);

  /* @ngInject */
  function UpdateChallengeController($scope, $stateParams, challengeDetail, growl, ChallengeService, VideoService, UploadService, showDetail) {
    $scope.showId = $stateParams.showId;
    $scope.data = angular.copy(challengeDetail);
    $scope.data.expiresAt = new Date($scope.data.expiresAt);
    $scope.dateOptions = {
      minDate: new Date(),
    };
    $scope.prize = {
      title: '',
      description: '',
    };
    $scope.submitted = false;
    $scope.isUploading = false;
    $scope.prizeTitleError = false;
    $scope.prizeDescError = false;

    $scope.addPrize = function() {
      $scope.prizeTitleError = false;
      $scope.prizeDescError = false;
      if (!$scope.prize.title || ($scope.prize.title && $scope.prize.title.length > 30)) {
        $scope.prizeTitleError = true;
      }
      if (!$scope.prize.description || ($scope.prize.description && $scope.prize.description.length > 60)) {
        $scope.prizeDescError = true;
      }
      if ($scope.prizeTitleError || $scope.prizeDescError) {
        growl.error('Please check your prize data.');
      } else {
        $scope.data.prizes.push($scope.prize);
        $scope.prize = {
          title: '',
          description: '',
        };
      }
    };

    $scope.removePrize = function(index) {
      $scope.data.prizes.splice(index, 1);
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
      if (showDetail.status !== 'unpublished') {
        return growl.error('Cannot edit this challenge. Because show status is not unpublished');
      }
      if (form.$valid) {
        if ($scope.isUploading) {
          return growl.error('Please wait until upload process done');
        }
        $scope.submitted = true;
        var data = _.pick($scope.data, ['title', 'announcement', 'description', 'videoId', 'prizes']);
        ChallengeService.update({showId: $stateParams.showId, id: $stateParams.id}, data).$promise.then(function(resp) {
          $scope.submitted = false;
          growl.success('Updated challenge successfully');
        }).catch(function() {
          $scope.submitted = false;
          growl.error('Something wrong. Please try again later');
        });
      }
    };
  }
})();
