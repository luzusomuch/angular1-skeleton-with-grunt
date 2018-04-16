(function () {
  'use strict';
  angular.module('measureApp').controller('EditPartnerController', EditPartnerController);

  /* @ngInject */
  function EditPartnerController($scope, $stateParams, growl, AccountService, partnerDetail) {
    $scope.submitted = false;
    $scope.data = partnerDetail;

    $scope.submit = function(form) {
      if (form.$valid) {
        $scope.submitted = true;
        var data = _.pick($scope.data, ['firstName', 'lastName']);
        data.email = $scope.data.uid;
        AccountService.update({id: $stateParams.id}, data).$promise.then(function(resp) {
          growl.success('Updated partner successfully');
          $scope.submitted = false;
        }).catch(function(err) {
          var msg = err.data ? err.data.message : 'Error when edit partner';
          growl.error(msg);
          $scope.submitted = false;
        });
      }
    };
  }
})();
