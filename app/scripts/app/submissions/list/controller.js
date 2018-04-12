(function () {
  'use strict';
  angular.module('measureApp').controller('SubmissionsListController', SubmissionsListController);

  /* @ngInject */
  function SubmissionsListController($scope, $state, $stateParams, SubmissionService, ChallengeService, growl, $uibModal, PushNotificationService) {
    $scope.pagination = {
      page: 1,
      limit: 20,
    };
    $scope.filter = {};
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
      params.userName = $scope.filter.userName;
      params.likeNumber = $scope.filter.likeNumber;
      params.proScore = $scope.filter.proScore;
      SubmissionService.list(params).$promise.then(function(resp) {
        $scope.items = resp.items;
        $scope.total = resp.total;
      });
    }

    search();

    $scope.pageChanged = function() {
      search();
    };

    $scope.onEnterUserName = function(e) {
      if (e.keyCode === 13) {
        search();
      }
    };

    $scope.onEnterLikeNumber = function(e) {
      if (e.keyCode === 13) {
        search();
      }
    };

    $scope.onEnterProScore = function(e) {
      if (e.keyCode === 13) {
        search();
      }
    };

    $scope.setPrize = function(item) {
      $uibModal.open({
        controller: 'SelectSubmissionWinnerModalController',
        controllerAs: 'swm',
        templateUrl: 'scripts/components/selectSubmissionWinnerModal/view.html',
        resolve: {
          challengeDetail: function() {
            return $scope.challengeDetail;
          },
          submissionDetail: function() {
            return item;
          }
        }
      }).result.then(function(prizeIndexes) {
        SubmissionService.setAsWinner({
          showId: $stateParams.showId,
          challengeId: $stateParams.challengeId,
          id: item._id,
        }, {prizeIndexes: prizeIndexes}).$promise.then(function() {
          search();
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

    $scope.notificationWinnerAnnouncement = function() {
      PushNotificationService.create().$promise.then(function() {
        growl.success('Sent winner announcement notification successfully');
      }).catch(function() {
        growl.error('Error when send winner announcement notification');
      });
    };

    $scope.notificationToWinner = function() {
      PushNotificationService.create().$promise.then(function() {
        growl.success('Sent notification to winner successfully');
      }).catch(function() {
        growl.error('Error when send notification to winner');
      });
    };
  }
})();
