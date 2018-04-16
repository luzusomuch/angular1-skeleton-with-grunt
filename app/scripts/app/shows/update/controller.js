(function () {
  'use strict';
  angular.module('measureApp').controller('UpdateShowController', UpdateShowController);

  /* @ngInject */
  function UpdateShowController($scope, $stateParams, showDetail, pageSettings, ShowService, 
    growl, showStatusesUnableToUpdate, ImageService, UploadService, $uibModal, $state) {
    var numberOfChallenges = showDetail.numberOfChallenges;
    $scope.isAllowUpdateShow = showStatusesUnableToUpdate.indexOf(showDetail.status) === -1;
    $scope.isAllowUpdateStatus = showDetail.status==='unpublished' && pageSettings['SHOW']['MIN_NUMBER_OF_CHALLENGES'] <= numberOfChallenges;
    $scope.data = angular.copy(showDetail);
    $scope.data.expiresAt = new Date($scope.data.expiresAt);
    $scope.showStatuses = pageSettings['SHOW_STATUSES'];
    $scope.submitted = false;
    $scope.isUploading = false;

    var minDate = new Date();
    $scope.dateOptions = {
      minDate: minDate
    };

    $scope.upload = function(file) {
      if (file) {
        $scope.isUploading = true;
        ImageService.create().$promise.then(function(thumbnailData) {
          UploadService.uploadVideo(thumbnailData, file).then(function() {
            $scope.data.thumbnailUrl = thumbnailData.originalUrl;
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

    $scope.submit = function(form) {
      if (!$scope.isAllowUpdateShow) {
        return growl.error('This show do not allow to update');
      }
      if ($scope.isUploading) {
        return growl.error('Please wait until upload process done');
      }
      if (form.$valid) {
        updateShow();
      }
    };

    function updateShow() {
      $scope.data.expiresAt = new Date(moment($scope.data.expiresAt).endOf('day'));
      var data = _.pick($scope.data, ['title', 'status', 'expiresAt', 'thumbnailUrl', 'brightcoveId', 'duration']);
      // handle show status we only allow to update status when show reached enough challenges numbers
      if (pageSettings['SHOW']['MIN_NUMBER_OF_CHALLENGES'] > numberOfChallenges || pageSettings['SHOW']['MAX_NUMBER_OF_CHALLENGES'] < numberOfChallenges || data.status !== 'published') {
        delete data.status;
      }
      $scope.submitted = true;
      ShowService.update({id: $stateParams.id}, data).$promise.then(function() {
        $scope.submitted = false;
        growl.success('Updated show successfully');
        $state.go('app.show.list');
      }).catch(function() {
        $scope.submitted = false;
        growl.error('Something wrong. Please try again later');
      });
    }
  }
})();
