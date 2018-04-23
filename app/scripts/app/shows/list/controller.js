(function () {
  'use strict';
  angular.module('measureApp').controller('ShowsListController', ShowsListController);

  /* @ngInject */
  function ShowsListController($scope, $state, ShowService, showStatusesUnableToUpdate, growl, $uibModal, pageSettings, PushNotificationService) {
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
    $scope.showStatuses = angular.copy(pageSettings['SHOW_STATUSES']);
    $scope.showStatuses.unshift('all');

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
      ShowService.list(params).$promise.then(function(resp) {
        $scope.items = resp.items;
        $scope.total = resp.total;
      });
    }

    search();

    $scope.pageChanged = function() {
      search();
    };

    $scope.onSelectStatus = function() {
      $scope.pagination.page = 1;
      search();
    };

    $scope.onEnterTitle = function(e) {
      if (e.keyCode === 13) {
        $scope.pagination.page = 1;
        search();
      }
    };

    $scope.editShow = function(item) {
      $state.go('app.show.update', {id: item._id});
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
              return 'Do you want to delete this show? <br> It will remove all challenges belong to this.';
            },
            confirmButton: function() {
              return 'Delete';
            }
          }
        }).result.then(function() {
          ShowService.delete({id: item._id}).$promise.then(function() {
            $scope.items.splice(index, 1);
            $scope.total--;
            growl.success('Deleted a show successfully');
          }).catch(function() {
            growl.error('Error when delete a show. Please try again');
          });
        });
      } else {
        growl.error('Cannot delete Published/Closed show');
      }
    };

    $scope.viewThumbnail = function(item) {
      $uibModal.open({
        controller: 'ViewThumbnailModalController',
        controllerAs: 'vm',
        templateUrl: 'scripts/components/viewThumbnailModal/view.html',
        resolve: {
          thumbnailUrl: function() {
            return item.thumbnailUrl;
          }
        }
      });
    };

    $scope.addNewChallange = function(item) {
      if (item.numberOfChallenges < pageSettings['SHOW']['MAX_NUMBER_OF_CHALLENGES']) {
        $state.go('app.challenge.create', {showId: item._id});
      } else {
        growl.error('Cannot add more challenges because show has enough required challenges');
      }
    };

    $scope.sendNotification = function(item) {
      ShowService.publishNotifications({id: item._id}).$promise.then(function() {
        item.notifiedOnPublish = true;
        growl.success('Sent push notification to everybody successfully');
      }).catch(function() {
        growl.error('Error when send push notification to everybody');
      });
    };
  }
})();
