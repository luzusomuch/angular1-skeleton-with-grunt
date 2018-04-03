(function () {
  'use strict';
  angular.module('measureApp').controller('CreateChallengeController', CreateChallengeController);

  /* @ngInject */
  function CreateChallengeController($scope, $stateParams, growl, ChallengeService, VideoService, UploadService, pageSettings, showDetail) {
    var maximumChallenge = pageSettings['MAXIMUM_NUMBER_OF_CHALLENGES_ACTIVE_SHOW'];
    $scope.data = {
      title: '',
      description: '',
      announcement: '',
      expiresAt: new Date(),
      prizes: [],
      showId: $stateParams.showId
    };
    $scope.dateOptions = {
      minDate: new Date(),
      maxDate: new Date(showDetail.expiresAt)
    };
    $scope.prize = {
      title: '',
      description: '',
    };
    $scope.submitted = false;
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

    $scope.submit = function(form) {
      if (showDetail.numberOfChallenges >= maximumChallenge) {
        return growl.error('This show has reached maximum number of challenges');
      }
      var endTimeValidity = moment($scope.data.expiresAt).isSameOrBefore(moment(showDetail.expiresAt));
      form.expiresAt.$setValidity("endTime", endTimeValidity);
      if (form.$valid && $scope.file) {
        var isVideo = UploadService.checkVideoType($scope.file);
        if (isVideo) {
          $scope.submitted = true;
          VideoService.create().$promise.then(function(videoData) {
            UploadService.uploadVideo(videoData, $scope.file).then(function() {
              VideoService.update({id: videoData._id}, {status: 'uploaded'});
              $scope.data.videoId = videoData._id;
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
                  showId: $stateParams.showId
                };
                showDetail.numberOfChallenges++;
                form.$setDirty();
                form.$setUntouched();
                form.$setPristine();
                form.$submitted = false;
              }).catch(function(err) {
                $scope.submitted = false;
                growl.error('Failed to create new challenge');
              });
            }).catch(function(err) {
              $scope.submitted = false;
              growl.error('Failed to upload video');
            });
          }).catch(function() {
            $scope.submitted = false;
            growl.error('Failed to upload video');
          });
        } else {
          growl.error('Invalid File');
        }
      }
    };
  }
})();
