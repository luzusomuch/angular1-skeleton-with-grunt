(function () {
  'use strict';
  angular.module('measureApp').controller('CreateShowController', CreateShowController);

  /* @ngInject */
  function CreateShowController($scope, VideoService, growl, Upload, UploadService, ShowService, $state) {
    $scope.data = {
      title: '',
      expiresAt: new Date()
    };
    $scope.dateOptions = {
      minDate: new Date(),
    };
    $scope.submitted = false;

    $scope.submit = function(form) {
      if (form.$valid && $scope.file) {
        var isVideo = UploadService.checkVideoType($scope.file);
        if (isVideo) {
          $scope.submitted = true;
          VideoService.create().$promise.then(function(videoData) {
            UploadService.uploadVideo(videoData, $scope.file).then(function() {
              VideoService.update({id: videoData._id}, {status: 'uploaded'});
              $scope.data.videoId = videoData._id;
              $scope.data.expiresAt = new Date(moment($scope.data.expiresAt).endOf('day'));
              ShowService.create($scope.data).$promise.then(function() {
                $scope.submitted = false;
                growl.success('Show was created successfully');
                $scope.data = {
                  title: '',
                  expiresAt: new Date()
                };
                $scope.file = null;
                form.$setDirty();
                form.$setUntouched();
                form.$setPristine();
                form.$submitted = false;
                $state.go('app.show.list');
              }).catch(function(err) {
                $scope.submitted = false;
                growl.error('Failed to create new show');
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
