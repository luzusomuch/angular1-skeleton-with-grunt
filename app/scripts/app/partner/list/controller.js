(function () {
  'use strict';
  angular.module('measureApp').controller('PartnerListController', PartnerListController);

  /* @ngInject */
  function PartnerListController($scope, $state, growl, pageSettings) {
    $scope.pagination = {
      page: 1,
      limit: 20,
    };
    $scope.filter = {
      status: 'all',
      title: null
    };
    $scope.items = [];
    $scope.total = 0;

    function search(params) {
      params = params || {};
      _.merge(params, angular.copy($scope.pagination));
      params.page--;
      if ($scope.filter.status === 'all') {
        params.status = pageSettings['SHOW_STATUSES'].toString();
      } else {
        params.status = $scope.filter.status;
      }
      params.title = $scope.filter.title;
      // ShowService.list(params).$promise.then(function(resp) {
      //   $scope.items = resp.items;
      //   $scope.total = resp.total;
      // });
    }

    search();

    $scope.pageChanged = function() {
      search();
    };
  }
})();
