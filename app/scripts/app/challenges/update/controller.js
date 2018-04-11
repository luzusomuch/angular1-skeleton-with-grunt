(function () {
  'use strict';
  angular.module('measureApp').controller('UpdateChallengeController', UpdateChallengeController);

  /* @ngInject */
  function UpdateChallengeController($scope, $stateParams, $state, challengeDetail, growl, ChallengeService, VideoService, UploadService, showDetail) {
    var originalVideoUrl = angular.copy(challengeDetail.video.originalUrl);
    $scope.showId = $stateParams.showId;
    $scope.showDetail = showDetail;
    $scope.data = angular.copy(challengeDetail);
    $scope.data.expiresAt = new Date($scope.data.expiresAt);
    $scope.data.prizes = $scope.data.prizes || [];
    $scope.data.videoUrl = angular.copy(challengeDetail.video.originalUrl);
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
    $scope.prizeTitleLengthError = false;
    $scope.prizeDescError = false;
    $scope.prizeDescLengthError = false;
    $scope.contentTypeError = false;
    $scope.contentLengthError = false;

    $scope.addPrize = function() {
      $scope.prizeTitleError = false;
      $scope.prizeTitleLengthError = false;
      $scope.prizeDescError = false;
      $scope.prizeDescLengthError = false;
      if ($scope.data.prizes.length === 2) {
        return true;
      }
      if (!$scope.prize.title) {
        $scope.prizeTitleError = true;
      } else if ($scope.prize.title && $scope.prize.title.length > 30) {
        $scope.prizeTitleLengthError = true;
      }
      if (!$scope.prize.description) {
        $scope.prizeDescError = true;
      } else if ($scope.prize.description && $scope.prize.description.length > 60) {
        $scope.prizeDescLengthError = true;
      }
      if ($scope.prizeTitleError || $scope.prizeDescError || $scope.prizeTitleLengthError || $scope.prizeDescLengthError) {
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
      if (file) {
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
      }
    };

    $scope.onBlurVideoUrl = function() {
      if ($scope.data.videoUrl) {
        $scope.isUploading = true;
        $scope.contentTypeError = false;
        $scope.contentLengthError = false;
        $http.head($scope.data.videoUrl, {
          headers: {
            'Access-Control-Allow-Headers': 'Content-Length'
          }
        }).then(function(resp) {
          $scope.isUploading = false;
          if (resp.headers('Content-Type') !== pageSettings['VIDEO_CONTENT_TYPE']) {
            $scope.contentTypeError = true;
          }
          var contentLength = resp.headers('Content-Length');
          if (contentLength && contentLength > 1024 * 1024 * 40) {
            $sope.contentLengthError = true;
          }
        }).catch(function() {
          growl.error('Error when getting video detail. Please try again');
          $scope.isUploading = false;
        });
      }
    };

    $scope.submit = function(form) {
      if (challengeDetail.status === 'closed') {
        return growl.error('Cannot edit Closed challenge');
      }
      if (showDetail.status !== 'unpublished') {
        return growl.error('Cannot edit challenge which has show status is Published/Closed');
      }
      if ($scope.data.prizes.length !== 2) {
        return true;
      }
      if (form.$valid) {
        if ($scope.isUploading) {
          return growl.error('Please wait until upload process done');
        }
        $scope.submitted = true;
        var data = _.pick($scope.data, ['title', 'announcement', 'description', 'videoId', 'prizes', 'expiresAt']);
        if ($scope.data.videoUrl && $scope.data.videoUrl !== originalVideoUrl) {
          data.videoUrl = $scope.data.videoUrl;
        }
        ChallengeService.update({showId: $stateParams.showId, id: $stateParams.id}, data).$promise.then(function(resp) {
          $scope.submitted = false;
          growl.success('Updated challenge successfully');
          $state.go('app.challenge.list', {showId: $scope.showId});
        }).catch(function() {
          $scope.submitted = false;
          growl.error('Something wrong. Please try again later');
        });
      }
    };
  }
})();
