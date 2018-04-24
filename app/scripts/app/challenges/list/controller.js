(function () {
  'use strict';
  angular.module('measureApp').controller('ChallengesListController', ChallengesListController);

  /* @ngInject */
  function ChallengesListController($scope, $q, ChallengeService, showDetail, $stateParams, $uibModal, growl, $state, pageSettings) {
    $scope.showId = $stateParams.showId;
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

    $scope.addNewChallenge = function() {
      if (showDetail.numberOfChallenges < pageSettings['SHOW']['MAX_NUMBER_OF_CHALLENGES']) {
        $state.go('app.challenge.create', {showId: $scope.showId});
      } else {
        growl.error('Cannot add more challenges because show has enough required challenges');
      }
    };

    $scope.editChallenge = function(item) {
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
            showDetail.numberOfChallenges--;
            growl.success('Challenge was deleted successfully');
          }).catch(function() {
            growl.error('Error when delete a challenge. Please try again');
          });
        });
      } else {
        growl.error('Cannot delete challenge because it belongs to Published/Closed show');
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
        $uibModal.open({
          controller: 'ConfirmModalController',
          controllerAs: 'cm',
          templateUrl: 'scripts/components/confirmModal/view.html',
          resolve: {
            title: function() {
              return 'Winner announcement confirmation';
            },
            description: function() {
              return 'Do you want to send notification to winner submission(s)?';
            },
            confirmButton: function() {
              return 'Send';
            }
          }
        }).result.then(function() {
          var prizes = angular.copy($scope.challengeDetail.prizes);
          if (prizes[0]) {
            ChallengeService.otherWinnerhNotifications({
              showId: $stateParams.showId,
              id: item._id,
              prizeIndex: 0,
            }, {}).$promise.then(function() {
              if (prizes[1]) {
                ChallengeService.otherWinnerhNotifications({
                  showId: $stateParams.showId,
                  id: item._id,
                  prizeIndex: 1,
                }, {}).$promise.then(function() {
                  growl.success('Successfully sent notification to winner');
                });
              } else {
                growl.success('Successfully sent notification to winner');
              }
            });
          }
        });
      }
    };
  }
})();
