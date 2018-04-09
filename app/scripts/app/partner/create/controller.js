(function () {
  'use strict';
  angular.module('measureApp').controller('CreatePartnerController', CreatePartnerController);

  /* @ngInject */
  function CreatePartnerController($scope, $state, growl, AuthService) {
    $scope.submitted = false;
    $scope.data = {};

    $scope.submit = function(form) {
      if (form.$valid) {
        $scope.submitted = true;
        var data = _.pick($scope.data, ['uid', 'firstName', 'lastName', 'password']);
        AuthService.registerPartner(data).then(function(resp) {
          growl.success('Created partner successfully');
          form.$setDirty();
          form.$setUntouched();
          form.$setPristine();
          $scope.submitted = false;
          $scope.data = {};
        }).catch(function() {
          growl.error('Error when create new partner');
          $scope.submitted = false;
        });
      }
    };
  }
})();
