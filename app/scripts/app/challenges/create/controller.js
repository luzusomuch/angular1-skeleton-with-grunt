(function () {
  'use strict';
  angular.module('measureApp').controller('CreateChallengeController', CreateChallengeController);

  /* @ngInject */
  function CreateChallengeController($scope, $stateParams, growl, ChallengeService, VideoService, UploadService, pageSettings, showDetail, $http) {
    var maximumChallenge = pageSettings['SHOW']['MAX_NUMBER_OF_CHALLENGES'];
    $scope.maximumPrize = pageSettings['CHALLENGE']['MAX_NUMBER_OF_PRIZES'];
    $scope.minimumPrize = pageSettings['CHALLENGE']['MIN_NUMBER_OF_PRIZES'];
    $scope.showDetail = showDetail;
    $scope.data = {
      title: '',
      description: '',
      announcement: '',
      expiresAt: new Date(),
      prizes: [],
      showId: $stateParams.showId,
      campaignId: pageSettings['WEBHOOK']['TEST_CAMPAIGN_ID'],
    };
    $scope.dateOptions = {
      minDate: new Date()
    };
    $scope.prize = {
      title: '',
      description: '',
    };
    $scope.submitted = false;
    $scope.isUploading = false;
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

    $scope.submit = function(form) {
      if (showDetail.numberOfChallenges >= maximumChallenge) {
        return growl.error('This show has reached maximum number of challenges');
      }
      if ($scope.data.prizes.length > $scope.maximumPrize || $scope.data.prizes.length < $scope.minimumPrize) {
        return true;
      }
      if ($scope.isUploading || $scope.isUploadingVideoUrl) {
        return growl.error('Please wait until upload process done');
      }
      if (form.$valid && !$scope.videoUrlError) {
        $scope.submitted = true;
        $scope.data.expiresAt = new Date(moment($scope.data.expiresAt).endOf('day'));
        ChallengeService.create({showId: $stateParams.showId}, $scope.data).$promise.then(function() {
          $scope.submitted = false;
          growl.success('Challenge was created successfully');
          $scope.data = {
            title: '',
            description: '',
            announcement: '',
            expiresAt: new Date(),
            prizes: [],
            showId: $stateParams.showId,
            campaignId: pageSettings['WEBHOOK']['TEST_CAMPAIGN_ID'],
          };
          $scope.file = null;
          showDetail.numberOfChallenges++;
          form.$setDirty();
          form.$setUntouched();
          form.$setPristine();
          form.$submitted = false;
        }).catch(function(err) {
          $scope.submitted = false;
          growl.error('Failed to create new challenge');
        });
      }
    };
  }
})();
