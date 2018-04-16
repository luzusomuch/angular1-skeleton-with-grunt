(function () {
  'use strict';
  angular.module('measureApp').controller('CreateShowController', CreateShowController);

  /* @ngInject */
  function CreateShowController($scope, growl, Upload, UploadService, ShowService, $state, ImageService, pageSettings) {
    $scope.data = {
      title: '',
      expiresAt: new Date(),
      duration: 10,
      brightcoveId: pageSettings['SHOW']['DEFAULT_BRIGHTCOVE_ID']
    };
    $scope.dateOptions = {
      minDate: new Date(),
    };
    $scope.submitted = false;

    $scope.submit = function(form) {
      if (form.$valid && $scope.file) {
        var isPhoto = UploadService.checkImageType($scope.file);
        if (isPhoto) {
          $scope.submitted = true;
          ImageService.create({contentType: $scope.file.type}).$promise.then(function(thumbnailData) {
            UploadService.uploadThumbnail(thumbnailData, $scope.file).then(function() {
              $scope.data.thumbnailUrl = thumbnailData.originalUrl;
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
