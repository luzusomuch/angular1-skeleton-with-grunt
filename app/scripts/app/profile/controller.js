(function () {
  'use strict';
  angular.module('measureApp').controller('ProfileController', ProfileController);

  /* @ngInject */
  function ProfileController($scope, user, UserService, growl) {
    $scope.submitted = false;
    $scope.user = user;

    $scope.submit = function(form) {
      if (form.$valid) {
        $scope.submitted = true;
        var data = _.pick($scope.user, ['firstName', 'lastName']);
        UserService.update({id: 'me'}, data).$promise.then(function() {
          growl.success('Updated profile successfully');
          $scope.submitted = false;
        }).catch(function() {
          growl.error('Error when update profile');
          $scope.submitted = false;
        });
      }
    };
  }
})();
