(function () {
  'use strict';
  angular.module('measureApp').controller('ShowsListController', ShowsListController);

  /* @ngInject */
  function ShowsListController($scope, $state, ShowService, showStatusesUnableToUpdate, growl) {
    $scope.pagination = {
      page: 1,
      limit: 20,
    };
    $scope.items = [];
    $scope.total = 0;

    function search(params) {
      params = params || {};
      _.merge(params, angular.copy($scope.pagination));
      params.page--;
      ShowService.list(params).$promise.then(function(resp) {
        $scope.items = resp.items;
        $scope.total = resp.total;
      });
    }

    search();

    $scope.pageChanged = function() {
      search();
    };

    $scope.editShow = function(item) {
      if (showStatusesUnableToUpdate.indexOf(item.status) === -1) {
        $state.go('app.show.update', {id: item._id});
      } else {
        growl.error('This show do not allow to update');
      }
    };
  }
})();
