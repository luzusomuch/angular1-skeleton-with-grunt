(function () {
  'use strict';
  angular.module('measureApp').controller('CreateShowController', CreateShowController);

  /* @ngInject */
  function CreateShowController($scope, VideoService, growl, Upload) {
    $scope.data = {
      title: '',
    };

    $scope.submit = function(form) {
      if (form.$valid) {
        VideoService.create().$promise.then(function(videoData) {
          Upload.upload({
            method: 'PUT',
            url: videoData.uploadUrl,
            data: {
              key: videoData.key,
              AWSAccessKeyId: videoData.AWSAccessKeyId,
              acl: videoData.acl,
              signature: videoData.signature,
              'Content-Type': $scope.file.type !== '' ? $scope.file.type : 'binary/octet-stream',
              file: $scope.file,
              filename: $scope.file.name,
            },
          }).then(function(resp) {
            console.log(resp);
          }, function(err) {
            console.log(err);
          });
        });
      }
    };
  }
})();
