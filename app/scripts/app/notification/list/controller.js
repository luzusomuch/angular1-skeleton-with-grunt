(function () {
  'use strict';
  angular.module('measureApp').controller('NotificationsListController', NotificationsListController);

  /* @ngInject */
  function NotificationsListController($scope, ConfigService, $state) {
    $scope.pagination = {
      page: 1,
      limit: 20
    };
    $scope.items = [];
    $scope.total = 0;

    function search() {
      var params = angular.copy($scope.pagination);
      params.page--;
      params.category = 'NOTIFICATION';
      ConfigService.list(params).$promise.then(function(resp) {
        $scope.items = resp.items;
        $scope.total = resp.total;
      });
    }

    search();

    $scope.pageChanged = function() {
      search();
    };

    $scope.editContent = function(item) {
      $state.go('app.notification.update', {id: item._id});
    };
  }
})();
