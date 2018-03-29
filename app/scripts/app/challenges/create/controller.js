(function () {
  'use strict';
  angular.module('measureApp').controller('CreateChallengeController', CreateChallengeController);

  /* @ngInject */
  function CreateChallengeController($scope) {
    $scope.data = {
      title: '',
      description: '',
      announcement: '',
      expiresAt: new Date(),
      prizes: [],
    };
    $scope.dateOptions = {
      minDate: new Date(),
    };
    $scope.prize = {
      title: '',
      description: '',
    };
    $scope.submitted = false;

    $scope.addPrize = function() {
      if ($scope.prize.title && $scope.prize.description) {
        $scope.data.prizes.push($scope.prize);
      }
    };

    $scope.removePrize = function(index) {
      $scope.data.prizes.splice(index, 1);
    };

    $scope.submit = function(form) {
      if (form.$valid && $scope.file) {
        var isVideo = UploadService.checkVideoType($scope.file);
        if (isVideo) {
          $scope.submitted = true;
          VideoService.create().$promise.then(function(videoData) {
            UploadService.uploadVideo(videoData, $scope.file).then(function() {
              VideoService.update({id: videoData._id}, {status: 'uploaded'});
              $scope.data.videoId = videoData._id;
              ShowService.create($scope.data).$promise.then(function() {
                $scope.submitted = false;
                growl.success('Show was created successfully');
              }).catch(function(err) {
                $scope.submitted = false;
                growl.error('Failed to create new show');
              });
            }).catch(function(err) {
              $scope.submitted = false;
              growl.error('Failed to upload video');
            });
          });
        } else {
          growl.error('Invalid File');
        }
      }
    };
  }
})();
