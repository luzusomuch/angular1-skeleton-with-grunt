(function () {
  'use strict';
  angular.module('measureApp').controller('SettingsController', SettingsController);

  /* @ngInject */
  function SettingsController($scope, growl, ConfigService) {
    $scope.submitted = false;

    $scope.pagination = {
      page: 1,
      limit: 20
    };

    function search() {
      var params = angular.copy($scope.pagination);
      params.page--;
      params.category = 'SITE';
      ConfigService.list(params).$promise.then(function(resp) {
        $scope.data = resp.items[0];
      });
    }

    search();

    $scope.submit = function() {
      $scope.submitted = true;
      var data = _.pick($scope.data, ['value']);
      ConfigService.update({id: $scope.data._id}, data).$promise.then(function() {
        $scope.submitted = false;
        growl.success('Updated setting successfully');
      }).catch(function() {
        $scope.submitted = false;
        growl.error('Error when update setting');
      });
    };
  }
})();
