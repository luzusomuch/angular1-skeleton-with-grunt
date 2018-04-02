(function () {
  'use strict';
  angular.module('measureApp').controller('ShowsListController', ShowsListController);

  /* @ngInject */
  function ShowsListController($scope, $state, ShowService, showStatusesUnableToUpdate, growl, $uibModal) {
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

    $scope.deleteShow = function(item, index) {
      if (item.status === 'unpublished') {
        $uibModal.open({
          controller: 'ConfirmModalController',
          controllerAs: 'cm',
          templateUrl: 'scripts/components/confirmModal/view.html',
          resolve: {
            title: function() {
              return 'Delete Show Confirmation';
            },
            description: function() {
              return 'Are you sure that you want to delete this show? It will remove all challenges belong to this.';
            }
          }
        }).result.then(function() {
          ShowService.delete({id: item._id}).$promise.then(function() {
            $scope.items.splice(index, 1);
            $scope.total--;
          }).catch(function() {
            growl.error('Error when delete a show. Please try again');
          });
        });
      } else {
        growl.error('Cannot delete unpublished show');
      }
    };
  }
})();
