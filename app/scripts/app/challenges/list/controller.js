(function () {
  'use strict';
  angular.module('measureApp').controller('ChallengesListController', ChallengesListController);

  /* @ngInject */
  function ChallengesListController($scope, ChallengeService, showDetail, $stateParams, $uibModal, growl) {
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

    $scope.removeChallenge = function(item) {
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
              return 'Are you sure that you want to delete this challenge?';
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
        growl.error('Cannot delete unpublished show');
      }
    };
  }
})();
