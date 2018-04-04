(function () {
  'use strict';
  angular.module('measureApp').controller('SubmissionsListController', SubmissionsListController);

  /* @ngInject */
  function SubmissionsListController($scope, $state, $stateParams, SubmissionService, ChallengeService, growl, $uibModal) {
    $scope.pagination = {
      page: 1,
      limit: 20,
    };
    $scope.items = [];
    $scope.total = 0;

    $scope.challengeDetail = {};
    ChallengeService.get({showId: $stateParams.showId, id: $stateParams.challengeId}).$promise.then(function(resp) {
      $scope.challengeDetail = resp;
    });

    function search(params) {
      params = params || {};
      _.merge(params, angular.copy($scope.pagination));
      params.page--;
      params.showId = $stateParams.showId;
      params.challengeId = $stateParams.challengeId;
      SubmissionService.list(params).$promise.then(function(resp) {
        $scope.items = resp.items;
        $scope.total = resp.total;
      });
    }

    search();

    $scope.pageChanged = function() {
      search();
    };

    $scope.setPrize = function(item) {
      $uibModal.open({
        controller: 'SelectSubmissionWinnerModalController',
        controllerAs: 'swm',
        templateUrl: 'scripts/components/selectSubmissionWinnerModal/view.html',
        resolve: {
          challengeDetail: function() {
            return $scope.challengeDetail;
          }
        }
      }).result.then(function(prizeIndex) {
        SubmissionService.setAsWinner({
          showId: $stateParams.showId,
          challengeId: $stateParams.challengeId,
          id: item._id,
        }, {prizeIndex: prizeIndex}).$promise.then(function() {
          growl.success('Select winner submission successfully');
        }).catch(function() {
          growl.error('Error when select winner submission');
        });
      });
    };

    $scope.viewVideo = function(item) {
      $uibModal.open({
        controller: 'ViewVideoModalController',
        controllerAs: 'vm',
        templateUrl: 'scripts/components/viewVideoModal/view.html',
        resolve: {
          videoDetail: function() {
            return item.content.video;
          }
        }
      });
    };
  }
})();
