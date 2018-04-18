(function () {
  'use strict';
  angular.module('measureApp').controller('UpdateChallengeController', UpdateChallengeController);

  /* @ngInject */
  function UpdateChallengeController($scope, $stateParams, $state, challengeDetail, growl, ChallengeService, VideoService, UploadService, showDetail, $http, pageSettings, ImageService) {
    $scope.maximumPrize = pageSettings['CHALLENGE']['MAX_NUMBER_OF_PRIZES'];
    $scope.minimumPrize = pageSettings['CHALLENGE']['MIN_NUMBER_OF_PRIZES'];
    $scope.originalVideoUrl = angular.copy(challengeDetail.video.originalUrl);
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
    $scope.isUploadingThumbnail = false;
    $scope.isUploadingVideoUrl = false;
    $scope.prizeTitleError = false;
    $scope.prizeTitleLengthError = false;
    $scope.prizeDescError = false;
    $scope.prizeDescLengthError = false;
    $scope.contentTypeError = false;
    $scope.contentLengthError = false;
    $scope.videoUrlError = false;

    $scope.addPrize = function() {
      $scope.prizeTitleError = false;
      $scope.prizeTitleLengthError = false;
      $scope.prizeDescError = false;
      $scope.prizeDescLengthError = false;
      if ($scope.data.prizes.length === $scope.maximumPrize) {
        return growl.error('You have reached maximum number of prizes');
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
            $scope.videoUrlError = false;
            delete $scope.data.videoUrl;
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
        $scope.isUploadingVideoUrl = true;
        $scope.contentTypeError = false;
        $scope.contentLengthError = false;
        $scope.videoUrlError = false;
        $http.head($scope.data.videoUrl, {
          headers: {
            'Access-Control-Allow-Headers': 'Content-Length'
          }
        }).then(function(resp) {
          $scope.isUploadingVideoUrl = false;
          if (resp.headers('Content-Type') !== pageSettings['VIDEO_CONTENT_TYPE']) {
            $scope.contentTypeError = true;
          }
          var contentLength = resp.headers('Content-Length');
          if (contentLength && contentLength > 1024 * 1024 * 40) {
            $scope.contentLengthError = true;
          }
          delete $scope.data.videoId;
          $scope.file = null;
        }).catch(function() {
          growl.error('Error when getting video detail. Please try again');
          $scope.isUploadingVideoUrl = false;
          $scope.videoUrlError = true;
        });
      }
    };

    $scope.uploadThumbnail = function(file) {
      if (file) {
        $scope.isUploadingThumbnail = true;
        ImageService.create().$promise.then(function(thumbnailData) {
          UploadService.uploadVideo(thumbnailData, file).then(function() {
            $scope.data.thumbnailUrl = thumbnailData.originalUrl;
            $scope.isUploadingThumbnail = false;
            delete $scope.data.videoId;
            $scope.file = null;
          }).catch(function(err) {
            growl.error('Failed to upload video');
            $scope.isUploadingThumbnail = false;
          });
        }).catch(function() {
          growl.error('Failed to upload video');
          $scope.isUploadingThumbnail = false;
        });
      }
    };

    $scope.submit = function(form) {
      if ($scope.data.prizes.length > $scope.maximumPrize || $scope.data.prizes.length < $scope.minimumPrize) {
        return true;
      }
      if (form.$valid && !$scope.videoUrlError) {
        if ($scope.isUploading || $scope.isUploadingVideoUrl || $scope.isUploadingThumbnail) {
          return growl.error('Please wait until upload process done');
        }
        $scope.submitted = true;
        var data = _.pick($scope.data, ['title', 'announcement', 'description', 'prizes', 'expiresAt', 'videoUrl', 'videoId', 'thumbnailUrl']);
        if (!$scope.data.videoUrl || $scope.data.videoUrl === $scope.originalVideoUrl) {
          delete data.videoUrl;
        }
        if (!$scope.data.videoId) {
          delete data.videoId;
        }
        if (!$scope.data.thumbnailUrl) {
          delete data.thumbnailUrl;
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
