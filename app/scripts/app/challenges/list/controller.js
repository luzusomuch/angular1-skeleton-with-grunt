(function () {
  'use strict';
  angular.module('measureApp').controller('ChallengesListController', ChallengesListController);

  /* @ngInject */
  function ChallengesListController($scope, ChallengeService, $stateParams) {
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
  }
})();
