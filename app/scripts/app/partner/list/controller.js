(function () {
  'use strict';
  angular.module('measureApp').controller('PartnerListController', PartnerListController);

  /* @ngInject */
  function PartnerListController($scope, $state, growl, pageSettings, AccountService, $uibModal) {
    $scope.pagination = {
      page: 1,
      limit: 20,
    };
    $scope.filter = {
      role: 'all',
    };
    $scope.items = [];
    $scope.total = 0;
    // var defaultRoles = angular.copy(pageSettings['ROLES']);
    // var index = defaultRoles.indexOf('admin');
    // if (index !== -1) {
    //   defaultRoles.splice(index, 1);
    // }
    // $scope.partnerRoles = angular.copy(defaultRoles);
    // $scope.partnerRoles.unshift('all');

    function search(params) {
      params = params || {};
      _.merge(params, angular.copy($scope.pagination));
      params.page--;
      // params.roles = $scope.filter.role === 'all' ? defaultRoles.toString() : $scope.filter.role;
      params.roles = 'partner';
      params.name = $scope.filter.name;
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

    $scope.onKeydownName = function(e) {
      if (e.keyCode === 13) {
        $scope.pagination.page = 1;
        search();
      }
    };

    $scope.onBlurName = function() {
      $scope.pagination.page = 1;
      search();
    };

    $scope.deletePartner = function(item, index) {
      $uibModal.open({
        controller: 'ConfirmModalController',
        controllerAs: 'cm',
        templateUrl: 'scripts/components/confirmModal/view.html',
        resolve: {
          title: function() {
            return 'Deactive Partner Confirmation';
          },
          description: function() {
            return 'Do you want to deactive this partner?';
          },
          confirmButton: function() {
            return 'Deactivate';
          }
        }
      }).result.then(function() {
        AccountService.update({id: item._id}, {status: 'inactive'}).$promise.then(function() {
          item.status = 'inactive';
        }).catch(function() {
          growl.error('Error when deactive partner. Please try again');
        });
      });
    };
  }
})();
