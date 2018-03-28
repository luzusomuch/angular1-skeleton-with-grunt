(function () {
  'use strict';
  angular.module('measureApp').controller('ChallengesListController', ChallengesListController);

  /* @ngInject */
  function ChallengesListController($scope, ShowService) {
    $scope.pagination = {
      page: 1,
      limit: 20,
    };
    $scope.items = [];
    $scope.totalItem = 0;

    function search(params) {
      ShowService.get(params).$promise.then(function(resp) {
        console.log(resp);
      });
    }

    search($scope.pagination);
  }
})();
