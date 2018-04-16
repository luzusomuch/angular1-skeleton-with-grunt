(function () {
  'use strict';
  angular.module('measureApp').controller('ChallengesListController', ChallengesListController);

  /* @ngInject */
  function ChallengesListController($scope, $q, ChallengeService, showDetail, $stateParams, $uibModal, growl, $state, pageSettings) {
    $scope.showId = $stateParams.showId;
    $scope.isAllowCreateChallenge = showDetail.numberOfChallenges !== pageSettings['SHOW']['MAX_NUMBER_OF_CHALLENGES'] && showDetail.status === 'unpublished';
    $scope.pagination = {
      page: 1,
      limit: 20,
    };
    $scope.items = [];
    $scope.total = 0;

    function search(params) {
      params.page--;
      ChallengeService.get({showId: $scope.showId}, params).$promise.then(function(resp) {
        $scope.items = resp.items;
        $scope.total = resp.total;
      });
    }

    search($scope.pagination);

    $scope.editChallenge = function(item) {
      if (item.status === 'closed') {
        return growl.error('Cannot edit Closed challenge');
      }
      if (showDetail.status !== 'unpublished') {
        return growl.error('Cannot edit challenge which has show status is Published/Closed');
      }
      $state.go('app.challenge.update', {showId: $scope.showId, id: item._id});
    };

    $scope.removeChallenge = function(item, index) {
      if (showDetail.status === 'unpublished') {
        $uibModal.open({
          controller: 'ConfirmModalController',
          controllerAs: 'cm',
          templateUrl: 'scripts/components/confirmModal/view.html',
          resolve: {
            title: function() {
              return 'Delete Challenge Confirmation';
            },
            description: function() {
              return 'Do you want to delete this challenge?';
            },
            confirmButton: function() {
              return 'Delete';
            }
          }
        }).result.then(function() {
          ChallengeService.delete({showId: $scope.showId, id: item._id}).$promise.then(function() {
            $scope.items.splice(index, 1);
            $scope.total--;
          }).catch(function() {
            growl.error('Error when delete a challenge. Please try again');
          });
        });
      } else {
        growl.error('Cannot delete challenge belongs to Published/Closed show');
      }
    };

    $scope.viewVideo = function(item) {
      $uibModal.open({
        controller: 'ViewVideoModalController',
        controllerAs: 'vm',
        templateUrl: 'scripts/components/viewVideoModal/view.html',
        resolve: {
          videoDetail: function() {
            return item.video;
          }
        }
      });
    };

    $scope.sendNotification = function(item) {
      if (item.status === 'closed') {
        var promises = [];
        _.each(item.prizes, function(prize, $index) {
          promises.push(ChallengeService.otherWinnerhNotifications({
            showId: $stateParams.showId,
            id: item._id,
            prizeIndex: $index,
          }).$promise);
        });
        $q.all(promises).then(function() {
          growl.success('Sent winner announcement notification successfully');
        }).catch(function() {
          growl.error('Error when send winner announcement notification');
        });
      }
    };
  }
})();
