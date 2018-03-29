(function () {
  'use strict';
  angular.module('measureApp').controller('CreateShowController', CreateShowController);

  /* @ngInject */
  function CreateShowController($scope, VideoService, growl, Upload, UploadService, ShowService) {
    $scope.data = {
      title: '',
      expiresAt: new Date(),
    };

    $scope.submit = function(form) {
      if (form.$valid && $scope.file) {
        console.log($scope.file);
        var isVideo = UploadService.checkVideoType($scope.file);
        if (isVideo) {
          VideoService.create().$promise.then(function(videoData) {
            UploadService.uploadVideo(videoData, $scope.file).then(function() {
              VideoService.update({id: videoData._id}, {status: 'uploaded'});
              $scope.data.videoId = videoData._id;
              ShowService.create($scope.data).$promise.then(function(resp) {
                console.log(resp);
              }).catch(function(err) {
                console.log(err);
              });
            }).catch(function(err) {
              console.log(err);
            });
          });
        } else {
          growl.error('Invalid File');
        }
      }
    };
  }
})();
