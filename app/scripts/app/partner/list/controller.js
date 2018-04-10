(function () {
  'use strict';
  angular.module('measureApp').controller('PartnerListController', PartnerListController);

  /* @ngInject */
  function PartnerListController($scope, $state, growl, pageSettings, AccountService) {
    $scope.pagination = {
      page: 1,
      limit: 20,
    };
    $scope.filter = {
      role: 'all',
    };
    $scope.items = [];
    $scope.total = 0;
    var defaultRoles = angular.copy(pageSettings['ROLES']);
    var index = defaultRoles.indexOf('admin');
    if (index !== -1) {
      defaultRoles.splice(index, 1);
    }
    $scope.partnerRoles = angular.copy(defaultRoles);
    $scope.partnerRoles.unshift('all');

    function search(params) {
      params = params || {};
      _.merge(params, angular.copy($scope.pagination));
      params.page--;
      params.roles = $scope.filter.role === 'all' ? defaultRoles.toString() : $scope.filter.role;
      AccountService.list(params).$promise.then(function(resp) {
        $scope.items = resp.items;
        $scope.total = resp.total;
      });
    }

    search();

    $scope.pageChanged = function() {
      search();
    };

    $scope.onSelectRole = function() {
      $scope.pagination.page = 1;
      search();
    };
  }
})();
