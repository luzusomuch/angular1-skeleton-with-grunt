(function () {
  'use strict';
  angular.module('measureApp').controller('CreateChallengeController', CreateChallengeController);

  /* @ngInject */
  function CreateChallengeController($scope) {
    $scope.data = {
      title: '',
      description: '',
      announcement: '',
      expiresAt: new Date()
    };
    $scope.dateOptions = {
      minDate: new Date(),
    };
    $scope.submitted = false;
    $scope.thumbnails = [];
  }
})();
