(function () {
  'use strict';
  angular.module('measureApp').controller('ShowsListController', ShowsListController);

  /* @ngInject */
  function ShowsListController($scope, ShowService) {
    $scope.pagination = {
      page: 1,
      limit: 20,
    };
    $scope.items = [];
    $scope.total = 0;

    function search(params) {
      ShowService.list(params).$promise.then(function(resp) {
        $scope.items = resp.items;
        $scope.total = resp.total;
      });
    }

    search($scope.pagination);
  }
})();
